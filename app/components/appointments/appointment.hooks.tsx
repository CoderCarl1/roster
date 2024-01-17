import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { addFullAddress, addFullName, dates, isAppointment } from '@functions';
import { TAppointmentWithCustomerNameAndFullAddress } from '@types';

export type CalendarAppointment = {
    time: string;
    appointment: TAppointmentWithCustomerNameAndFullAddress | null;
};
export type CalendarDayType = {
    date: string;
    dayName: string;
    dayNumber: string;
    data: CalendarAppointment[];
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
        appointmentsArray: TAppointmentWithCustomerNameAndFullAddress[]
    ) => void;
    setAppointment: (appointmentId?: string) => void;
    setAppointmentProviderDate: (date: Date) => void;
    appointmentsData: TAppointmentWithCustomerNameAndFullAddress[];
    appointmentsForToday: TAppointmentWithCustomerNameAndFullAddress[];
    appointmentsForWeek: TAppointmentWithCustomerNameAndFullAddress[];
    appointmentsForMonth: TAppointmentWithCustomerNameAndFullAddress[];
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
    const [appointmentsList, setAppointmentsList] = useState<
        TAppointmentWithCustomerNameAndFullAddress[]
    >([]);
    const appointmentsForToday = useMemo(
        () => getVisibleAppointmentsForDay(currentDate),
        [currentDate]
    );
    const appointmentsForWeek = useMemo(
        () => getVisibleAppointmentsForWeek(currentDate),
        [currentDate]
    );
    const appointmentsForMonth = useMemo(
        () => getVisibleAppointmentsForMonth(currentDate),
        [currentDate]
    );
    const timeSlotsForToday = useMemo(
        () => getDayTimeSlots(currentDate, appointmentsForToday),
        [currentDate, appointmentsForToday]
    );
    const timeSlotsForWeek = useMemo(
        () => getWeekTimeSlots(currentDate, appointmentsForWeek),
        [currentDate, appointmentsForWeek]
    );
    const timeSlotsForMonth = useMemo(
        () => getMonthTimeSlots(currentDate, appointmentsForMonth),
        [currentDate, appointmentsForMonth]
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

    function setAppointmentProviderDate(date: Date) {
        date = dates.parseDate(date);
        setCurrentDate(date);
    }

    function setAppointments(
        appointmentsArray: TAppointmentWithCustomerNameAndFullAddress[]
    ) {
        setAppointmentsList(appointmentsArray);
    }

    const appointmentsData = useMemo(() => {
        return appointmentsList.reduce<
            TAppointmentWithCustomerNameAndFullAddress[]
        >((acc, appointment) => {
            let updatedAppointment = addFullName(appointment);

            if ('address' in updatedAppointment) {
                updatedAppointment = addFullAddress(updatedAppointment);
            }

            if (isAppointment(updatedAppointment)) {
                acc.push(updatedAppointment);
            }
            return acc;
        }, []);
    }, [appointmentsList]);

    useEffect(() => {}, [appointmentsData]);

    function setAppointment(appointmentId?: string) {
        let data = null;
        if (appointmentId && appointmentsList) {
            data =
                appointmentsList.find(
                    (appointment) => appointment.id === appointmentId
                ) ?? null;
        }
        setCurrentAppointment(data);
    }
    /**
     * Gets the calendar data for a day separated into timeslots of 15 min,
     *
     * @param selectedDate - The selected date.
     * @param appointments - The list of appointments.
     * @returns CalendarDayType - {date: date, dayname: string, data: calendar data}.
     */

    function getDayTimeSlots(
        selectedDate: Date,
        appointments: TAppointmentWithCustomerNameAndFullAddress[] = appointmentsList
    ): CalendarDayType {
        const calendarData: {
            time: string;
            appointment: TAppointmentWithCustomerNameAndFullAddress | null;
        }[] = [];
        const timeStringToCompare = new Date(selectedDate);

        for (let i = DAYSTART; i < DAYEND; i++) {
            const hour = i < 10 ? `0${i}` : `${i}`;

            for (let j = 0; j < 60; j += 15) {
                const minute = j < 10 ? `0${j}` : `${j}`;
                const timeString = `${hour}:${minute}`;

                const appointment =
                    appointments.find((apt) => {
                        const appointmentStart = new Date(apt.start);
                        const appointmentEnd = new Date(apt.end);

                        timeStringToCompare.setHours(i, j, 0, 0);

                        return (
                            appointmentStart <= timeStringToCompare &&
                            appointmentEnd > timeStringToCompare
                        );
                    }) || null;

                calendarData.push({
                    time: timeString,
                    appointment: appointment ?? null,
                });
            }
        }

        return {
            dayNumber: `${dates.dayNumberFromDate(selectedDate)}`,
            date: timeStringToCompare.toLocaleString(),
            dayName: dates.getDayName(selectedDate),
            data: calendarData,
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
        appointments: TAppointmentWithCustomerNameAndFullAddress[] = appointmentsList
    ): CalendarWeekType {
        const calendar: CalendarDayType[] = [];
        let currentDate = new Date(selectedDate);

        for (let d = 0; d < 7; d++) {
            const dayData = getDayTimeSlots(currentDate, appointments);
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
     * @param appointments - The list of appointments.
     * @returns The calendar data for the month.
     */
    function getMonthTimeSlots(
        selectedDate: Date,
        appointments: TAppointmentWithCustomerNameAndFullAddress[] = appointmentsList
    ): CalendarMonthType {
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
            const calendarWeek: CalendarWeekType = [];

            for (let day = 0; day < 7; day++) {
                const calendarDay = getDayTimeSlots(startDate, appointments);
                calendarWeek.push(calendarDay);

                startDate = dates.incrementDayByOne(startDate);
            }

            calendar.push(calendarWeek);
        }
        return calendar;
    }

    function getVisibleAppointmentsForDay(selectedDate: Date) {
        if (!appointmentsList.length) return [];
        const day = new Date(selectedDate);
        const appointmentData = appointmentsList.filter((appointment) => {
            const appointmentDate = new Date(appointment.start);

            return (
                appointmentDate.getDate() === day.getDate() &&
                appointmentDate.getMonth() === day.getMonth() &&
                appointmentDate.getFullYear() === day.getFullYear()
            );
        });
        return appointmentData;
    }

    function getVisibleAppointmentsForWeek(selectedStartDate: Date) {
        if (!appointmentsList.length) return [];

        const startOfWeek = new Date(selectedStartDate);
        const selectedEndDate = new Date(startOfWeek);
        selectedEndDate.setDate(startOfWeek.getDate() + 6);

        const appointmentData = appointmentsList.filter((appointment) => {
            const appointmentDate = new Date(appointment.start);
            return (
                appointmentDate >= startOfWeek &&
                appointmentDate <= selectedEndDate
            );
        });
        return appointmentData;
    }

    function getVisibleAppointmentsForMonth(dateWithinMonth: Date) {
        if (!appointmentsList.length) return [];

        const startDate = dates.parseDate(dateWithinMonth);

        // Check if the start date is not a Sunday, and adjust it to the nearest Sunday
        if (startDate.getDay() !== 0) {
            const nearestSunday = dates.startOfWeek(startDate).getTime();
            startDate.setTime(nearestSunday);
        }

        // Calculate the end date by getting the end of the week for the last day of the month
        const lastDay = new Date(
            startDate.getFullYear(),
            startDate.getMonth() + 1,
            0
        );
        const endDate = dates.endOfWeek(lastDay);

        const appointmentData = appointmentsList.filter((appointment) => {
            const appointmentDate = new Date(appointment.start);

            return appointmentDate >= startDate && appointmentDate <= endDate;
        });
        return appointmentData;
    }

    const value = {
        currentAppointment,
        setAppointments,
        setAppointment,
        setAppointmentProviderDate,
        appointmentsData,
        appointmentsForToday,
        appointmentsForWeek,
        appointmentsForMonth,
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
