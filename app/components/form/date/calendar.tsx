import {
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import React, { useEffect, useMemo, useRef, useState } from "react"
import { monthNames, shortMonthNames, shortWeekDay, weekDays } from "~/functions/helpers/dates";
import { dates, joinClasses } from "@functions";
import { Button, ErrorCard } from "@components";
import { visibleDayType } from "@types";
import { Arrow } from "~/icons";

type calendarDataType = {
  currentDate: Date;
  monthName: string;
  daysInMonth: number;
  startOfWeek: Date;
  endOfWeek: Date;
}
type calendarDisplayTypes = 'day' | 'week' | 'month';

function useCalendar() {
  function getCalendarDateParts(date: Date | String) {
    date = dates.parseDate(date);

    return {
      currentDate: date,
      monthName: monthNames[ date.getMonth() ],
      daysInMonth: dates.getDaysInMonth(date.getFullYear(), date.getMonth()),
      startOfWeek: dates.startOfWeek(date),
      endOfWeek: dates.endOfWeek(date),
    };
  }

  function getNextMonth(date: Date) {
    let { year, month } = dates.dateParts(date);

    if (month === 11) {
      month = 0;
      year = year + 1;
    } else {
      month = month + 1
    }
    return new Date(year, month, 1);
  }

  function getPrevMonth(date: Date) {
    let { year, month } = dates.dateParts(date);

    if (month === 0) {
      month = 11;
      year = year - 1;
    } else {
      month = month - 1
    }
    return new Date(year, month, 1);
  }

  return {
    getCalendarDateParts,
    getNextMonth,
    getPrevMonth,
  }
}

type CalendarProps = {
  calendarType?: calendarDisplayTypes;
  date?: Date;
  cb?: () => unknown;
  className?: string;
}

export default function Calendar({ calendarType, date, cb, className = '', ...props }: CalendarProps) {
  const today = new Date();
  const { getCalendarDateParts } = useCalendar();
  const [ internalCalendarType, setInternalCalendarType ] = useState<string>('month')
  const [ calendarData, setCalendarData ] = useState<calendarDataType>({
    currentDate: today,
    monthName: monthNames[ today.getMonth() ],
    daysInMonth: dates.getDaysInMonth(today.getFullYear(), today.getMonth()),
    startOfWeek: dates.startOfWeek(today),
    endOfWeek: dates.endOfWeek(today),
  });

  function handleDateChange(date: Date | String) {
    const data = getCalendarDateParts(date);
    setCalendarData({ ...data })
  }
  function handleCalendarTypeChange(newType: string) {
    setInternalCalendarType(newType)
  }

  useEffect(() => {
    if (!date) return;
    handleDateChange(date);
  }, [ date ])

  useEffect(() => {
    if (!calendarType) return;
    handleCalendarTypeChange(calendarType);
  }, [ calendarType ])

  return (
    <div key={internalCalendarType}
      className={joinClasses('calendar__wrapper', className)}
      {...props}>
        {calendarData.currentDate.toLocaleDateString()}
      <CalendarControls
        handleCalendarTypeChange={handleCalendarTypeChange}
        handleDateChange={handleDateChange}
        currentDate={calendarData.currentDate}
      />
      <div className="calendar__content">
        <CalendarComponent
          internalCalendarType={internalCalendarType}
          handleDateChange={handleDateChange}
          currentDate={calendarData.currentDate}
        />
      </div>
    </div>
  );
}

type calendarControlProps = {
  handleCalendarTypeChange: (type: string) => void;
  handleDateChange: (date: Date | String) => void;
  currentDate: Date;
}
function CalendarControls({ handleCalendarTypeChange, handleDateChange, currentDate }: calendarControlProps) {
  const { getPrevMonth, getNextMonth } = useCalendar();

  function handleNext() {
    const newDate = getNextMonth(currentDate);
    handleDateChange(newDate);
  }
  function handlePrev() {
    const newDate = getPrevMonth(currentDate);
    handleDateChange(newDate);
  }
  return (
    <div className="calendar__controls">
      {[ 'day', 'week', 'month' ].map(calendarType => {
        return (
          <Button key={"calendar__control" + calendarType} onClick={() => handleCalendarTypeChange(calendarType)}>{calendarType}</Button>
        )
      })
      }
      <div>
        <Button onClick={handlePrev} ><Arrow className="left" /></Button>
        <Button onClick={handleNext}><Arrow className="right" /></Button>
      </div>
    </div>
  )
}

type CalendarComponentProps = {
  internalCalendarType: string;
  handleDateChange: (date: Date | String) => void;
  currentDate: Date;
}
function CalendarComponent({ internalCalendarType, handleDateChange, currentDate }: CalendarComponentProps) {

  switch (internalCalendarType) {
    case 'day':
      return <DayView handleDateChange={handleDateChange} currentDate={currentDate} />;
    case 'week':
      return <WeekView handleDateChange={handleDateChange} currentDate={currentDate} />;
    case 'month':
      return <MonthView handleDateChange={handleDateChange} currentDate={currentDate} />;
    default:
      return null;
  }
}
type viewProps = {
  handleDateChange: (date: Date | String) => void;
  currentDate: Date;
}

function DayView({ handleDateChange, currentDate }: viewProps) {
  const todayString = new Date().toLocaleDateString();
  const selectedDate = currentDate.toLocaleDateString();
  const visibleDays = useMemo(() => {
    return dates.getVisibleDayNumbersInArray(currentDate);
  }, [ currentDate ]);

  function handleDaySelect(e: React.MouseEvent<HTMLButtonElement>) {
    const dateString = e.currentTarget.dataset.date;
    if (!dateString) return;
    handleDateChange(dateString);
  }
  return (
    <table
      role="region"
      aria-labelledby="calendar_caption"
      tabIndex={0}
      className="calendar__view"
      data-calendartype="day"
    >
      <caption className='visually-hidden' id="calendar_caption">Days within {dates.getMonthName(currentDate)}</caption>
      <thead>
        <tr className="weekday_initials">
          {shortWeekDay.map((initial, idx) => (
            <th
              className="initial"
              abbr={weekDays[ idx ]}
              key={initial + idx + 'date-picker'}
            >
              {initial}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {visibleDays.length && visibleDays.map((week, weekIndex) => {
          return (
            <tr
              key={weekIndex + 'date-picker'}
              className="calendar__selector--days week"
            >
              {week.length && week.map((day, dayIndex) => {
                let dayClasses = day.inMonth ? '' : 'notInMonth';
                let dayString = day.date.toLocaleDateString();

                return (
                  <td
                    key={day.number + weekIndex + dayIndex}
                    className={joinClasses('calendar__selection--days day', dayClasses)}
                  >
                    <Button
                      data-date={day.date}
                      onClick={handleDaySelect}
                      aria-selected={`${selectedDate === dayString}`}
                      aria-current={todayString === dayString ? "date" : undefined}
                    >
                      {day.number}
                    </Button>
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function WeekView({ handleDateChange, currentDate }: viewProps) {
  const { getCalendarDateParts } = useCalendar();

  const visibleDays = useMemo(() => {
    return dates.getVisibleDayNumbersInArray(currentDate);
  }, [ currentDate ]);

  function handleCalendarWeekSelect(dateArray: visibleDayType[]) {
    const month = currentDate.getMonth();
    let dateToSet: Date;
    if (dateArray[ 0 ].date.getMonth() !== month) {
      dateToSet = dateArray[ 6 ].date;
      dateToSet.setDate(1);
    } else {
      dateToSet = dateArray[ 0 ].date;
    }
    handleDateChange(dateToSet);
  }
  function isWithinWeek(date: Date) {
    const { startOfWeek, endOfWeek } = getCalendarDateParts(date);

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
      <caption className="visually-hidden" id="calendar_caption">Weeks within {dates.getMonthName(currentDate)}</caption>
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
        {visibleDays.length && visibleDays.map((week, weekIndex) => {
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

function MonthView({ handleDateChange, currentDate }: viewProps) {
  const { getCalendarDateParts } = useCalendar();
  const {monthName} = getCalendarDateParts(currentDate);
  const actualMonth = monthNames[new Date().getMonth()];
  function handleMonthSelect(monthNumber: number){
    const date = new Date(currentDate.getFullYear(), monthNumber, 1);
    handleDateChange(date);
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
      <p className="visually-hidden" id="calendar_caption">Months</p>
      {monthNames.map((month, idx) => {
        if (month === monthName) {
          return (
            <Button
              key={'month-grid' + idx}
              className="calendar__selection--month month current"
              onClick={() => handleMonthSelect(idx)}
              aria-label={`set month to ${month}`}
              aria-selected="true"
              aria-current={actualMonth === month ? "true" : undefined}
            >
              {shortMonthNames[ idx ]}
            </Button>
          );
        }
        return (
          <Button
            key={'month-grid' + idx}
            className="calendar__selection--month month "
            onClick={() => handleMonthSelect(idx)}
            aria-label={`set month to ${month}`}
            aria-current={actualMonth === month ? "true" : undefined}
          >
            {shortMonthNames[ idx ]}
          </Button>
        );
      })}
    </div>
  )
}


export function ErrorBoundary() {
  const error = useRouteError();

  let errorHeading: string, errorMessage: string, errorStack: string | undefined;

  if (isRouteErrorResponse(error)) {
    errorHeading = `${error.status} ${error.statusText}`;
    errorMessage = `${error.data}`;
  } else if (error instanceof Error) {
    errorStack = JSON.stringify(error.stack, null, 2);
    errorHeading = 'Error';
    errorMessage = error.message;
  } else {
    errorHeading = 'Unknown Error';
    errorMessage = 'An unknown error occurred.';
  }


  return <ErrorCard errorHeading={errorHeading} errorMessage={errorMessage} errorStack={errorStack} />
}