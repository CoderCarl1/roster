import { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { visibleDayType } from '@types';
import { dates, log } from '~/functions';

type CalendarContextType = {
    currentCalendarDate: Date;
    nextMonth: () => void;
    prevMonth: () => void;
    setCalendarDate: (date: Date | string) => void;
    monthName: string;
    visibleDates: visibleDayType[][] | undefined;
};
type visibleDatesStateType = { data: visibleDayType[][]; date: Date };
const CalendarContext = createContext<CalendarContextType | null>(null);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
    const today = new Date();
    const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(today);
    const [currentVisibleDates, setCurrentVisibleDates] =
        useState<visibleDatesStateType>();

    useEffect(() => {
        setVisibleDates();
    }, []);

    function setCalendarDate(date: Date | string) {
        date = dates.parseDate(date);
        setCurrentCalendarDate(date);
    }

    function setVisibleDates(date: Date = new Date()) {
        const data = dates.getVisibleDayNumbersInArray(date);
        setCurrentVisibleDates({ data, date });
    }

    const monthName = useMemo(() => {
        return dates.getMonthName(currentVisibleDates?.date || new Date());
    }, [currentVisibleDates?.date]);

    function nextMonth() {
        if (!currentVisibleDates) {
            setVisibleDates();
            return;
        }
        let { year, month } = dates.dateParts(currentVisibleDates.date);
        if (month === 11) {
            month = 0;
            year = year + 1;
        } else {
            month = month + 1;
        }
        const nextMonthDate = new Date(year, month, 1);
        setVisibleDates(nextMonthDate);
    }

    function prevMonth() {
        if (!currentVisibleDates) {
            setVisibleDates();
            return;
        }
        let { year, month } = dates.dateParts(currentVisibleDates.date);

        if (month === 0) {
            month = 11;
            year = year - 1;
        } else {
            month = month - 1;
        }

        const prevMonthDate = new Date(year, month, 1);
        setVisibleDates(prevMonthDate);
    }

    const value = {
        currentCalendarDate,
        setCalendarDate,
        monthName,
        nextMonth,
        prevMonth,
        visibleDates: currentVisibleDates && currentVisibleDates.data,
    };
    return (
        <CalendarContext.Provider value={value}>
            {children}
        </CalendarContext.Provider>
    );
}

export function useCalendar() {
    const context = useContext(CalendarContext);

    if (!context) {
        throw new Error(
            'useCalendarContext must be used within a CalendarProvider'
        );
    }
    return context;
}
