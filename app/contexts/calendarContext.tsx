import { createContext, useState, useContext } from 'react';
import { dates, log } from '~/functions';

type CalendarDateType = {
    day: number;
    month: number;
    year: number;
    date: Date;
    dayName: string;
    monthName: string;
};
type CalendarContextType = {
    currentDate: CalendarDateType;
    nextDay: () => void;
    nextWeek: () => void;
    nextMonth: () => void;
    prevDay: () => void;
    prevWeek: () => void;
    prevMonth: () => void;
    setDate: (date: Date) => void;
};
const CalendarContext = createContext<CalendarContextType | null>(null);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState<CalendarDateType>({
        day: today.getDate(),
        month: today.getMonth(),
        year: today.getFullYear(),
        date: today,
        dayName: dates.getDayName(today),
        monthName: today.toLocaleString(undefined, { month: 'long' }),
    });

    function setDate(date: Date) {
        const today = dates.parseDate(date);
        setCurrentDate({
            day: today.getDate(),
            month: today.getMonth(),
            year: today.getFullYear(),
            date: today,
            dayName: dates.getDayName(today),
            monthName: today.toLocaleString(undefined, { month: 'long' }),
        });
    }

    function nextDay() {
        const nextDayDate = dates.calculateFutureDate(currentDate.date, 1);
        setDate(nextDayDate);
    }
    function nextWeek() {
        const nextWeekDate = dates.calculateFutureDate(currentDate.date, 7);
        setDate(nextWeekDate);
    }
    function nextMonth() {
        const daysToAdd =
            dates.getDaysInMonth(currentDate.year, currentDate.month) -
            currentDate.day +
            1;

        const nextMonthDate = dates.calculateFutureDate(
            currentDate.date,
            daysToAdd
        );
        setDate(nextMonthDate);
    }
    function prevDay() {
        const nextDayDate = dates.calculatePastDate(currentDate.date, 1);
        setDate(nextDayDate);
    }
    function prevWeek() {
        const nextDayDate = dates.calculatePastDate(currentDate.date, 7);
        setDate(nextDayDate);
    }
    function prevMonth() {
        let month = currentDate.month - 1;
        let year = currentDate.year;
        if (currentDate.month - 1 < 0) {
            month = 11;
            year = year - 1;
        }
        const daysToMinus = dates.getDaysInMonth(year, month) + currentDate.day;

        const prevMonthDate = dates.calculatePastDate(
            currentDate.date,
            daysToMinus
        );
        setDate(prevMonthDate);
    }

    const value = {
        currentDate,
        nextDay,
        prevDay,
        nextWeek,
        prevWeek,
        nextMonth,
        prevMonth,
        setDate,
    };
    return (
        <CalendarContext.Provider value={value}>
            {children}
        </CalendarContext.Provider>
    );
}

export function useCalendarContext() {
    const context = useContext(CalendarContext);

    if (!context) {
        throw new Error(
            'useCalendarContext must be used within a CalendarProvider'
        );
    }
    return context;
}
