import { TAppointmentWithCustomerName } from '@types';

export type CalendarAppointment = {
    time: string;
    appointment: TAppointmentWithCustomerName | null;
};
export type CalendarDayType = {
    date: Date,
    data: CalendarAppointment[]
};
export type CalendarWeekType = CalendarDayType[];
export type CalendarMonthType = CalendarDayType[][];

export type CalendarType = CalendarDayType | CalendarWeekType | CalendarMonthType
function useCalendar() {
    function getDaysInMonth(year: number, month: number) {
        const nextMonth = new Date(year, month, 0);
        return nextMonth.getDate();
    }
    function incrementDayByOne(date: Date): Date {
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);
        return nextDate;
    }
    function getDayName(date: Date) {
        const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
        return date.toLocaleDateString('en-US', options);
    }
    function getDay(
        selectedDate: Date,
        appointments: TAppointmentWithCustomerName[]
    ): CalendarDayType {
        const calendarData: {
            time: string;
            appointment: TAppointmentWithCustomerName | null;
        }[] = [];
        for (let i = 0; i < 24; i++) {
            const hour = i < 10 ? `0${i}` : `${i}`;

            for (let j = 0; j < 60; j += 15) {
                const minute = j < 10 ? `0${j}` : `${j}`;
                const timeString = `${hour}:${minute}`;

                const appointment =
                    appointments.find((apt) => {
                        const appointmentStart = new Date(apt.start)
                        const appointmentEnd = new Date(apt.end)
                        const timeStringToCompare = new Date(selectedDate);
                        timeStringToCompare.setHours(i, j, 0, 0);

                        const found = (
                            appointmentStart <= timeStringToCompare &&
                            appointmentEnd > timeStringToCompare
                        );
                        return found
                    }) || null;

                calendarData.push({ time: timeString, appointment });
            }
        }

        return {
            date: selectedDate,
            data: calendarData
        };
    }
    function getWeek(
        selectedDate: Date,
        appointments: TAppointmentWithCustomerName[]
    ): CalendarWeekType {
        const calendar: CalendarDayType[] = [];
        let currentDate = new Date(selectedDate);

        for (let d = 0; d < 7; d++) {
            const dayData = getDay(currentDate, appointments);
            calendar.push(dayData);
            currentDate = incrementDayByOne(currentDate);
        }
        console.log("calendar in get weeek", calendar)
        return calendar;
    }
    function getMonth(
        selectedDate: Date,
        appointments: TAppointmentWithCustomerName[]
    ): CalendarMonthType {
        const calendar: CalendarWeekType[] = [];
        let currentDate = new Date(selectedDate);

        const daysInMonth = getDaysInMonth(
            currentDate.getFullYear(),
            currentDate.getMonth()
        );
        const numberOfWeeks = Math.ceil(daysInMonth / 7);
        for (let week = 0; week < numberOfWeeks; week++) {
            const calendarWeek: CalendarWeekType = [];

            for (let day = 0; day < 7; day++) {
                const calendarDay = getDay(currentDate, appointments);
                calendarWeek.push(calendarDay);

                currentDate = incrementDayByOne(currentDate);
            }

            calendar.push(calendarWeek);
        }

        return calendar;
    }

    return { getDaysInMonth, getDayName, getDay, getWeek, getMonth };
}

export { useCalendar as default };
