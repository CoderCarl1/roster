import { Button } from '~/components';
import { monthNames, shortMonthNames } from '~/functions/helpers/dates';
import { useCalendar } from '../calendar.hooks';

export default function MonthView() {
    const { currentCalendarDate, setCalendarDate, monthName } = useCalendar();

    const actualMonth = monthNames[new Date().getMonth()];

    function handleMonthSelect(monthNumber: number) {
        const date = new Date(
            currentCalendarDate.getFullYear(),
            monthNumber,
            1
        );
        setCalendarDate(date);
    }
    return (
        <div
            className="calendar__view"
            data-calendartype="month"
            role="region"
            aria-labelledby="calendar_caption"
            tabIndex={0}
        >
            <h1>{monthName}</h1>
            <p className="visually-hidden" id="calendar_caption">
                Months
            </p>
            {monthNames.map((month, idx) => {
                if (month === monthName) {
                    return (
                        <Button
                            key={'month-grid' + idx}
                            className="calendar__selection--month month current"
                            onClick={() => handleMonthSelect(idx)}
                            aria-label={`set month to ${month}`}
                            aria-selected="true"
                            aria-current={
                                actualMonth === month ? 'true' : undefined
                            }
                        >
                            {shortMonthNames[idx]}
                        </Button>
                    );
                }
                return (
                    <Button
                        key={'month-grid' + idx}
                        className="calendar__selection--month month "
                        onClick={() => handleMonthSelect(idx)}
                        aria-label={`set month to ${month}`}
                        aria-current={
                            actualMonth === month ? 'true' : undefined
                        }
                    >
                        {shortMonthNames[idx]}
                    </Button>
                );
            })}
        </div>
    );
}
