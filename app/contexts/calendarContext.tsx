import { createContext, useState, useContext } from 'react';
import { useCalendar } from '~/components/calendar';

type CalendarDateType = {
    day: number;
    month: number;
    year: number;
};
type CalendarContextType = {
    currentDate: CalendarDateType;
    nextDay: () => void;
    nextWeek: () => void;
    nextMonth: () => void;
};
const CalendarContext = createContext<CalendarContextType | null>(null);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
    const today = new Date();

    const [currentDate, setCurrentDate] = useState<CalendarDateType>({
        day: today.getDate(),
        month: today.getMonth(),
        year: today.getFullYear(),
    });
    const { getDaysInMonth } = useCalendar();

    function nextDay() {
        const tomorrowDayNumber = currentDate.day + 1;
        const numberOfDaysInMonth = getDaysInMonth(
            currentDate.year,
            currentDate.month
        );

        if (tomorrowDayNumber > numberOfDaysInMonth) {
            let newMonth = currentDate.month + 1;
            let newYear = currentDate.year;

            if (newMonth > 11) {
                newMonth = 1;
                newYear = currentDate.year + 1;
            }

            setCurrentDate({
                day: 1,
                month: newMonth,
                year: newYear,
            });
        } else {
            setCurrentDate({
                day: tomorrowDayNumber,
                month: currentDate.month,
                year: currentDate.year,
            });
        }
        console.log('set date to ', currentDate);
    }
    function nextWeek() {
        const daysInWeek = 7;
        const tomorrowDayNumber = currentDate.day + daysInWeek;
        const numberOfDaysInMonth = getDaysInMonth(
            currentDate.year,
            currentDate.month
        );

        if (tomorrowDayNumber > numberOfDaysInMonth) {
            // If the next week exceeds the current month, calculate the new month and year
            let newMonth = currentDate.month + 1;
            let newYear = currentDate.year;

            if (newMonth > 11) {
                newMonth = 0; // Reset to January
                newYear += 1; // Increment the year
            }

            setCurrentDate({
                day: tomorrowDayNumber - numberOfDaysInMonth,
                month: newMonth,
                year: newYear,
            });
        } else {
            // If the next week stays within the current month
            setCurrentDate({
                day: tomorrowDayNumber,
                month: currentDate.month,
                year: currentDate.year,
            });
        }
    }
    function nextMonth() {
        let newMonth = currentDate.month + 1;
        let newYear = currentDate.year;

        if (newMonth > 11) {
            newMonth = 0; // Reset to January
            newYear += 1; // Increment the year
        }

        setCurrentDate({
            day: currentDate.day,
            month: newMonth,
            year: newYear,
        });
    }
    const value = { currentDate, nextDay, nextWeek, nextMonth };
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
