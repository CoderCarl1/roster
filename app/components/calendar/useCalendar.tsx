import { dates, log } from '@functions';
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
function useCalendar() {

    const DAYSTART = 4;
    const DAYEND = 18;
    /**
     * Gets the calendar data for a day,
     *
     * @param selectedDate - The selected date.
     * @param appointments - The list of appointments.
     * @returns CalendarDayType - {date: date, dayname: string, data: calendar data}.
     */
    function getDay(
        selectedDate: Date,
        appointments: TAppointmentWithCustomerNameAndFullAddress[] = []
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

                calendarData.push({ time: timeString, appointment: appointment ?? null });
            }
        }

        return {
            dayNumber: dates.dayNumberFromDate(selectedDate),
            date: timeStringToCompare.toLocaleString(),
            dayName: dates.getDayName(selectedDate),
            data: calendarData,
        };
    }

    /**
     * Gets the calendar data for a week,
     * the week will always start on a sunday and end on a saturday
     *
     * @param selectedDate - The selected date within the week.
     * @param appointments - The list of appointments.
     * @returns The calendar data for the week.
     */
    function getWeek(
        selectedDate: Date,
        appointments: TAppointmentWithCustomerNameAndFullAddress[]
    ): CalendarWeekType {
        const calendar: CalendarDayType[] = [];
        let currentDate = new Date(selectedDate);

        for (let d = 0; d < 7; d++) {
            const dayData = getDay(currentDate, appointments);
            calendar.push(dayData);
            currentDate = dates.incrementDayByOne(currentDate);
        }
        return calendar;
    }

    /**
     * Gets the calendar data for a month,
     * the days will always start on a sunday and end on a saturday
     *
     * @param selectedDate - The selected date within the month.
     * @param appointments - The list of appointments.
     * @returns The calendar data for the month.
     */
    function getMonth(
        selectedDate: Date,
        appointments: TAppointmentWithCustomerNameAndFullAddress[]
    ): CalendarMonthType {
        console.log("GET MONTH appointments", appointments)
        const calendar: CalendarWeekType[] = [];
        const currentDate = new Date(selectedDate);
        const firstDayOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        );
        let startDate = dates.startOfWeek(firstDayOfMonth);

        const lastDayOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
        );
        const endDate = dates.endOfWeek(lastDayOfMonth);

        const totalDays = dates.getNumberOfDays(startDate, endDate);
        const numberOfWeeks = Math.ceil(totalDays / 7);

        for (let week = 0; week < numberOfWeeks; week++) {
            const calendarWeek: CalendarWeekType = [];

            for (let day = 0; day < 7; day++) {
                const calendarDay = getDay(startDate, appointments);
                calendarWeek.push(calendarDay);

                startDate = dates.incrementDayByOne(startDate);
            }

            calendar.push(calendarWeek);
        }
        console.log("returning this calendar", calendar)
        return calendar;
    }


    return { getDay, getWeek, getMonth };
}

export { useCalendar as default };
