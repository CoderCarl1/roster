import { TAppointmentWithCustomerName } from '@types';

type CalendarAppointment = {
    time: string;
    appointment: TAppointmentWithCustomerName | null;
};
type CalendarDayType = CalendarAppointment[];
type CalendarWeekType = CalendarAppointment[][];
type CalendarMonthType = CalendarAppointment[][][];

function useCalendar() {
    function getDaysInMonth(year: number, month: number) {
        const nextMonth = new Date(year, month, 0);
        return nextMonth.getDate();
    }

    function incrementDayByOne(date: Date) {
        date.setDate(date.getDate() + 1);
        return date;
    }

    function getDay(
        selectedDate: Date,
        appointments: TAppointmentWithCustomerName[]
    ): CalendarDayType {
        const calendar: {
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
                        const appointmentStart = new Date(
                            apt.start
                        ).toISOString();
                        const appointmentEnd = new Date(apt.end).toISOString();
                        const timeStringToCompare = `${
                            selectedDate.toISOString().split(',')[0]
                        }, ${hour}:${minute}`;
                        return (
                            appointmentStart <= timeStringToCompare &&
                            appointmentEnd > timeStringToCompare
                        );
                    }) || null;

                calendar.push({ time: timeString, appointment });
            }
        }

        return calendar;
    }
    function getWeek(
        selectedDate: Date,
        appointments: TAppointmentWithCustomerName[]
    ): CalendarWeekType {
        const calendar: CalendarDayType[] = [];
        let currentDate = new Date(selectedDate);

        for (let d = 0; d < 7; d++) {
            currentDate = incrementDayByOne(currentDate);

            const day = getDay(currentDate, appointments);
            calendar.push(day);
        }
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
    return { getDaysInMonth, getDay, getWeek, getMonth };
}

export { useCalendar as default };
