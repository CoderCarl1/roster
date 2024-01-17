import { isRouteErrorResponse, useRouteError } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { ErrorCard } from '~/components';
import { CalendarProvider, useCalendar } from '../calendar.hooks';
import CalendarControls from './Calendar.Controls';
import DateInputs from './DateInputs';
import DayView from './View.Day';
import MonthView from './View.Month';
import WeekView from './View.Week';

export type viewType = 'day' | 'week' | 'month';

type DatePickerProps = {
    cb?: (date: Date) => unknown;
    dateToSet?: Date;
} & React.HTMLProps<HTMLDivElement>;

export default function Main(props: DatePickerProps) {
    return (
        <CalendarProvider>
            <DatePicker {...props} />
        </CalendarProvider>
    );
}

function DatePicker({ cb, dateToSet, ...props }: DatePickerProps) {
    const { setCalendarDate, currentCalendarDate } = useCalendar();
    const [currentCalendarViewType, setCurrentCalendarViewType] =
        useState<viewType>('day');

    useEffect(() => {
        if (dateToSet) {
            setCalendarDate(dateToSet);
        }
    }, []);

    useEffect(() => {
        if (cb) {
            cb(currentCalendarDate);
        }
    }, [currentCalendarDate]);

    function handleCalendarViewChange(viewType: viewType) {
        if (!['day', 'week', 'month'].includes(viewType)) return;
        setCurrentCalendarViewType(viewType);
    }

    const calendarViews = {
        day: DayView,
        week: WeekView,
        month: MonthView,
    };
    const CalendarView = calendarViews[currentCalendarViewType];

    return (
        <DateInputs {...props}>
            {/* Children shown depending on toggle inside of DateInputs */}
            <CalendarControls
                currentCalendarViewType={currentCalendarViewType}
                handleCalendarViewChange={handleCalendarViewChange}
            />
            <CalendarView />
        </DateInputs>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();

    let errorHeading: string,
        errorMessage: string,
        errorStack: string | undefined;

    if (isRouteErrorResponse(error)) {
        errorHeading = `${error.status} ${error.statusText}`;
        errorMessage = `${error.data}`;
    } else if (error instanceof Error) {
        errorStack = JSON.stringify(error.stack, null, 2);
        errorHeading = 'DatePicker Error';
        errorMessage = error.message;
    } else {
        errorHeading = 'Unknown Error - DatePicker';
        errorMessage = 'An unknown error occurred.';
    }

    return (
        <ErrorCard
            errorHeading={errorHeading}
            errorMessage={errorMessage}
            errorStack={errorStack}
        />
    );
}
