import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { addFullAddress, addFullName, dates, isAppointment, log } from '@functions';
import { TAppointmentWithCustomerNameAndFullAddress } from '@types';

export type CalendarDayType = {
    date: string;
    dayName: string;
    dayNumber: string;
    slots: Record<string, TAppointmentWithCustomerNameAndFullAddress | null>;
};
export type CalendarWeekType = CalendarDayType[];
export type CalendarMonthType = CalendarDayType[][];

export type CalendarType =
    | CalendarDayType
    | CalendarWeekType
    | CalendarMonthType;

type AppointmentContextType = {
    currentAppointment: null | TAppointmentWithCustomerNameAndFullAddress;
    setAppointments: (
        appointments: Record<string, Record<string, TAppointmentWithCustomerNameAndFullAddress>>
    ) => void;
    setAppointment: (appointment: TAppointmentWithCustomerNameAndFullAddress) => void;
    setAppointmentProviderDate: (date: Date) => void;
    appointmentsList: TAppointmentWithCustomerNameAndFullAddress[];
    appointmentsData: Record<string, Record<string, TAppointmentWithCustomerNameAndFullAddress>>;
    // appointmentsForToday: TAppointmentWithCustomerNameAndFullAddress[];
    // appointmentsForWeek: TAppointmentWithCustomerNameAndFullAddress[];
    // appointmentsForMonth: TAppointmentWithCustomerNameAndFullAddress[];
    timeSlotsForToday: CalendarDayType;
    timeSlotsForWeek: CalendarWeekType;
    timeSlotsForMonth: CalendarMonthType;
};
const AppointmentContext = createContext<AppointmentContextType | null>(null);

export function AppointmentProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    // Date to start off on app load
    const today = new Date();
    // USER PREFERENCES
    const [DAYSTART, setDayStart] = useState(4);
    const [DAYEND, setDayEnd] = useState(18);

    const [currentDate, setCurrentDate] = useState(today);
    const [currentAppointment, setCurrentAppointment] =
        useState<null | TAppointmentWithCustomerNameAndFullAddress>(null);
    const [appointmentsData, setAppointmentsData] = useState<
    Record<string, Record<string, TAppointmentWithCustomerNameAndFullAddress>>
    >({});
    // const appointmentsForToday = useMemo(
    //     () => getVisibleAppointmentsForDay(currentDate),
    //     [currentDate]
    // );
    // const appointmentsForWeek = useMemo(
    //     () => getVisibleAppointmentsForWeek(currentDate),
    //     [currentDate]
    // );
    // const appointmentsForMonth = useMemo(
    //     () => getVisibleAppointmentsForMonth(currentDate),
    //     [currentDate]
    // );
    const timeSlotsForToday = useMemo(
        () => getDayTimeSlots(currentDate),
        [currentDate]
    );
    const timeSlotsForWeek = useMemo(
        () => getWeekTimeSlots(currentDate),
        [currentDate]
    );
    const timeSlotsForMonth = useMemo(
        () => getMonthTimeSlots(currentDate),
        [currentDate]
    );

    // TODO: USER OBJ NEEDS TO BE SET UP
    // useEffect(() => {
    //   function setUserPreferences(){
    //     const {dayStart, dayEnd} = userObj.preferences;
    //     setDayStart(dayStart);
    //     setDayEnd(dayEnd);
    //   }
    //   setUserPreferences()
    // }, [userObj])
    const appointmentsList = useMemo(() => {
        const appointmentArray: TAppointmentWithCustomerNameAndFullAddress[] = [];
        for(const key in appointmentsData){
            for(const time in appointmentsData[key]){
                appointmentArray.push(appointmentsData[key][time])
            }
        }
        return appointmentArray;
    }, [appointmentsData])

    function setAppointmentProviderDate(date: Date) {
        date = dates.parseDate(date);
        setCurrentDate(date);
    }

    function setAppointments(
        data: Record<string, Record<string, TAppointmentWithCustomerNameAndFullAddress>>
    ) {
        setAppointmentsData(data);
    }

    function setAppointment(appointment: TAppointmentWithCustomerNameAndFullAddress) {
        setCurrentAppointment(appointment);
    }
    /**
     * Gets the calendar data for a day separated into timeslots of 15 min,
     *
     * @param selectedDate - The selected date.
     * @param appointments - The list of appointments.
     * @returns CalendarDayType - {date: date, dayname: string, slots: 15 min slots}.
     */

    function getDayTimeSlots(
        selectedDate: Date,
    ): CalendarDayType {
        const calendarData: Record<string, TAppointmentWithCustomerNameAndFullAddress | null> = {};
        selectedDate = dates.parseDate(selectedDate);
        const selectedDateString = selectedDate.toLocaleString();
        const dayKey = dates.localDateStringFromDate(selectedDate);
        const appointments = {...appointmentsData}
        const dayAppointments = appointments[dayKey] || {};
        for (let i = DAYSTART; i < DAYEND; i++) {
            const hour = i.toString().padStart(2, '0');
    
            for (let j = 0; j < 60; j += 15) {
                const minute = j.toString().padStart(2, '0');
                const timeString = `${hour}:${minute}`;
                const appointment = dayAppointments[timeString] || null;
    
                calendarData[timeString] = appointment;
            }
        }
        return {
            dayNumber: `${dates.dayNumberFromDate(selectedDate)}`,
            date: selectedDateString,
            dayName: dates.getDayName(selectedDate),
            slots: calendarData,
        };
    }

    /**
     * Gets the calendar data for a week separated into timeslots of 15 min,
     * the week will always start on a sunday and end on a saturday
     *
     * @param selectedDate - The selected date within the week.
     * @param appointments - The list of appointments.
     * @returns The calendar data for the week.
     */
    function getWeekTimeSlots(
        selectedDate: Date,
    ): CalendarWeekType {
        const calendar: CalendarDayType[] = [];
        let currentDate = new Date(selectedDate);

        for (let d = 0; d < 7; d++) {
            const dayData = getDayTimeSlots(currentDate);
            calendar.push(dayData);
            currentDate = dates.incrementDayByOne(currentDate);
        }
        return calendar;
    }

    /**
     * Gets the calendar data for a month separated into timeslots of 15 min,
     * the days will always start on a sunday and end on a saturday
     *
     * @param selectedDate - The selected date within the month.
     * @returns The calendar data for the month.
     */
    function getMonthTimeSlots(
        selectedDate: Date,
    ): CalendarMonthType {
        console.time("get-month")
        const calendar: CalendarWeekType[] = [];
        const currentDate = dates.parseDate(selectedDate);
        const firstDayOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        );
        let startDate = dates.startOfWeek(firstDayOfMonth);
        let newYear = currentDate.getFullYear();
        let newMonth = currentDate.getMonth() + 1;

        if (newMonth > 11) {
            newMonth = 1;
            newYear = currentDate.getFullYear() + 1;
        }

        const lastDayOfMonth = new Date(newYear, newMonth, 0);
        const endDate = dates.endOfWeek(lastDayOfMonth);

        const totalDays = dates.getNumberOfDays(startDate, endDate);
        const numberOfWeeks = Math.ceil(totalDays / 7);

        for (let week = 0; week < numberOfWeeks; week++) {
            const calendarWeek: CalendarWeekType = getWeekTimeSlots(startDate);
            startDate = dates.calculateFutureDate(startDate, 6);
            calendar.push(calendarWeek);
        }
        console.timeEnd("get-month")
        return calendar;
    }

    // function getVisibleAppointmentsForDay(selectedDate: Date) {
    //     const timeSlots = getDayTimeSlots(selectedDate);

    //     const appointmentData = Object.values(timeSlots.slots).filter(appointment => appointment !== null);

    //     return appointmentData;
    // }

    // function getVisibleAppointmentsForWeek(selectedStartDate: Date) {
    //     if (!appointmentsList.length) return [];

    //     const startOfWeek = dates.parseDate(selectedStartDate);
    //     const selectedEndDate = dates.calculateFutureDate(startOfWeek, 6);
    //     const timeSlots = getWeekTimeSlots(startOfWeek);

    //     const appointmentData = appointmentsList.filter((appointment) => {
    //         const appointmentDate = new Date(appointment.start);
    //         return (
    //             appointmentDate >= startOfWeek &&
    //             appointmentDate <= selectedEndDate
    //         );
    //     });
    //     return appointmentData;
    // }

    // function getVisibleAppointmentsForMonth(dateWithinMonth: Date) {
    //     if (!appointmentsList.length) return [];

    //     const startDate = dates.parseDate(dateWithinMonth);

    //     // Check if the start date is not a Sunday, and adjust it to the nearest Sunday
    //     if (startDate.getDay() !== 0) {
    //         const nearestSunday = dates.startOfWeek(startDate).getTime();
    //         startDate.setTime(nearestSunday);
    //     }

    //     // Calculate the end date by getting the end of the week for the last day of the month
    //     const lastDay = new Date(
    //         startDate.getFullYear(),
    //         startDate.getMonth() + 1,
    //         0
    //     );
    //     const endDate = dates.endOfWeek(lastDay);

    //     const appointmentData = appointmentsList.filter((appointment) => {
    //         const appointmentDate = new Date(appointment.start);

    //         return appointmentDate >= startDate && appointmentDate <= endDate;
    //     });
    //     return appointmentData;
    // }

    const value = {
        currentAppointment,
        setAppointments,
        setAppointment,
        setAppointmentProviderDate,
        appointmentsData,
        appointmentsList,
        // appointmentsForToday,
        // appointmentsForWeek,
        // appointmentsForMonth,
        timeSlotsForToday,
        timeSlotsForWeek,
        timeSlotsForMonth,
    };
    return (
        <AppointmentContext.Provider value={value}>
            {children}
        </AppointmentContext.Provider>
    );
}

export function useAppointments() {
    const context = useContext(AppointmentContext);

    if (!context) {
        throw new Error(
            'useAppointments must be used within an AppointmentProvider'
        );
    }
    return context;
}
