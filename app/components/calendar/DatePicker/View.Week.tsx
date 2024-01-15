import { visibleDayType } from "@types";
import { useCalendar } from "../calendar.hooks";
import { dates, joinClasses } from "~/functions";
import { shortWeekDay, weekDays } from "~/functions/helpers/dates";
import { Button } from "~/components";


export default function WeekView() {
  const {currentCalendarDate, setCalendarDate, monthName, visibleDates } = useCalendar();

  function handleCalendarWeekSelect(dateArray: visibleDayType[]) {
    const month = currentCalendarDate.getMonth();
    let dateToSet: Date;
    if (dateArray[ 0 ].date.getMonth() !== month) {
      dateToSet = dateArray[ 6 ].date;
      dateToSet.setDate(1);
    } else {
      dateToSet = dateArray[ 0 ].date;
    }
    setCalendarDate(dateToSet);
  }
  function isWithinWeek(date: Date) {
    const { startOfWeek, endOfWeek } = dates.dateParts(date)
    
    return (
      date.toLocaleDateString() === startOfWeek.toLocaleDateString() ||
      date.toLocaleDateString() === endOfWeek.toLocaleDateString() ||
      (date < endOfWeek && date > startOfWeek))
  }

  function todayIsInWeek(week: visibleDayType[]) {
    if (dates.startOfWeek(new Date()).toDateString() === dates.startOfWeek(week[ 0 ].date).toDateString()) {
      return true
    }
    return undefined;
  }

  return (
    <table
      role="region"
      aria-labelledby="calendar_caption"
      tabIndex={0}
      className="calendar__view"
      data-calendartype="week"
    >
      <caption className="visually-hidden" id="calendar_caption">Weeks within {monthName}</caption>
      <thead>
        <tr className="weekday_initials">
          {shortWeekDay.map((initial, idx) => (
            <th
              abbr={weekDays[ idx ]}
              className="initial"
              key={"calendar__view" + initial + idx}>
              {initial}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {visibleDates?.length && visibleDates.map((week, weekIndex) => {
          let weekClasses = isWithinWeek(week[ 0 ].date) ? 'selected' : '';

          return (
            <tr key={weekIndex + 'date-picker'}>
              <td>
                <Button
                  className={joinClasses('calendar__selection--weeks week', weekClasses)}
                  onClick={() => handleCalendarWeekSelect(week)}
                  aria-label={`${dates.humanReadable(week[ 0 ].date)} to ${dates.humanReadable(week[ 6 ].date)}`}
                  aria-selected={`${isWithinWeek(week[ 0 ].date)}`}
                  aria-current={todayIsInWeek(week)}
                >
                  {week.map((day, dayIndex) => {
                    let dayClasses = day.inMonth ? '' : 'notInMonth';

                    return (
                      <span
                        className={joinClasses("calendar__selection--weeks day", dayClasses)}
                        key={day.number + weekIndex + dayIndex}
                      >
                        {day.number}
                      </span>
                    )
                  })}
                </Button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}