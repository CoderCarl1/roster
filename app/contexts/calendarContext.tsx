import { createContext, useState, useContext } from 'react';
import { dates } from '~/functions';

type CalendarDateType = {
    day: number;
    month: number;
    year: number;
    date: Date;
    dayName: string;
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
    const [ currentDate, setCurrentDate ] = useState<CalendarDateType>({
        day: today.getDate(),
        month: today.getMonth(),
        year: today.getFullYear(),
        date: today,
        dayName: dates.getDayName(today),
    });


    function setDate(date: Date) {
        const today = new Date(date);
        setCurrentDate({
            day: today.getDate(),
            month: today.getMonth(),
            year: today.getFullYear(),
            date: today,
            dayName: dates.getDayName(today),
        })
    }

    function nextDay() {
        const nextDayDate = calculateFutureDate(1);
        setDate(nextDayDate);
    }
    function nextWeek() {
        const nextWeekDate = calculateFutureDate(7)
        setDate(nextWeekDate);
    }
    function nextMonth() {
        const daysToAdd = dates.getDaysInMonth(
            currentDate.year,
            currentDate.month
        ) - currentDate.day;

        const nextMonthDate = calculateFutureDate(daysToAdd)
        setDate(nextMonthDate);
    }
    function prevDay() {
        const nextDayDate = calculatePastDate(1);
        setDate(nextDayDate);
    }
    function prevWeek() {
        const nextDayDate = calculatePastDate(7);
        setDate(nextDayDate);
    }
    function prevMonth() {
        const daysToMinus = dates.getDaysInMonth(
            currentDate.year,
            currentDate.month - 1
        ) + currentDate.day;

        const prevMonthDate = calculatePastDate(daysToMinus)
        setDate(prevMonthDate);
    }

    function calculateFutureDate(dayNumber: number) {
        console.log("calculateFutureDate day number to add", dayNumber)
        let newDay = currentDate.day;
        let newMonth = currentDate.month;
        let newYear = currentDate.year;
        const daysInCurrentMonth = dates.getDaysInMonth(newYear, newMonth);
    
        if (newDay + dayNumber <= daysInCurrentMonth) {
            newDay += dayNumber;
        } else {
            let daysToAdd = dayNumber - (daysInCurrentMonth - newDay);
            while (daysToAdd > 0) {
                newMonth += 1;
    
                if (newMonth > 11) {
                    newMonth = 0;
                    newYear += 1;
                }
    
                const daysInNextMonth = dates.getDaysInMonth(newYear, newMonth);
                newDay = daysToAdd <= daysInNextMonth ? daysToAdd : daysInNextMonth;
                daysToAdd -= daysInNextMonth;
            }
        }
    
        return new Date(newYear, newMonth, newDay);
    }

    function calculatePastDate(dayNumber: number) {
        let newDay = currentDate.day;
        let newMonth = currentDate.month;
        let newYear = currentDate.year;

        if (newDay >= dayNumber) {
            newDay -= dayNumber;
        } else {
            let daysInPreviousMonth = dates.getDaysInMonth(
                currentDate.year,
                currentDate.month - 1
            );

            while (newDay < dayNumber) {
                newMonth -= 1;

                if (newMonth < 0) {
                    newMonth = 11;
                    newYear -= 1;
                }

                newDay += daysInPreviousMonth;
                daysInPreviousMonth = dates.getDaysInMonth(newYear, newMonth - 1);
            }

            newDay -= dayNumber;
        }

        return new Date(newYear, newMonth, newDay);
    }

    const value = { currentDate, nextDay, prevDay, nextWeek, prevWeek, nextMonth, prevMonth, setDate };
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
