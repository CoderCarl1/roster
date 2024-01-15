import { Button } from '~/components';
import { joinClasses } from '~/functions';
import dates, { shortWeekDay, weekDays } from '~/functions/helpers/dates';
import { useCalendar } from '../calendar.hooks';

export default function DayView() {
    const { currentCalendarDate, setCalendarDate, monthName, visibleDates } =
        useCalendar();
    const todayString = new Date().toLocaleDateString();
    const selectedDate = currentCalendarDate.toLocaleDateString();

    function handleDaySelect(e: React.MouseEvent<HTMLButtonElement>) {
        const dateString = e.currentTarget.dataset.date;
        if (!dateString) return;
        setCalendarDate(dateString);
    }

    return (
        <table
            role="region"
            aria-labelledby="calendar_caption"
            tabIndex={0}
            className="calendar__view"
            data-calendartype="day"
        >
            <caption className="visually-hidden" id="calendar_caption">
                Days within {monthName}
            </caption>
            <thead>
                <tr className="weekday_initials">
                    {shortWeekDay.map((initial, idx) => (
                        <th
                            className="initial"
                            abbr={weekDays[idx]}
                            key={initial + idx + 'date-picker'}
                        >
                            {initial}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {visibleDates?.length
                    ? visibleDates.map((week, weekIndex) => {
                          return (
                              <tr
                                  key={weekIndex + 'date-picker'}
                                  className="calendar__selector--days week"
                              >
                                  {week.length
                                      ? week.map((day, dayIndex) => {
                                            const dayClasses = day.inMonth
                                                ? ''
                                                : 'notInMonth';
                                            const dayString =
                                                day.date.toLocaleDateString();

                                            return (
                                                <td
                                                    key={
                                                        day.number +
                                                        weekIndex +
                                                        dayIndex
                                                    }
                                                    className={joinClasses(
                                                        'calendar__selection--days day',
                                                        dayClasses
                                                    )}
                                                >
                                                    <Button
                                                        data-date={day.date}
                                                        onClick={
                                                            handleDaySelect
                                                        }
                                                        aria-selected={
                                                            selectedDate ===
                                                            dayString
                                                        }
                                                        aria-current={
                                                            todayString ===
                                                            dayString
                                                                ? 'date'
                                                                : undefined
                                                        }
                                                    >
                                                        {day.number}
                                                    </Button>
                                                </td>
                                            );
                                        })
                                      : null}
                              </tr>
                          );
                      })
                    : null}
            </tbody>
        </table>
    );
}
