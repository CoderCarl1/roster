import {
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import React, { useEffect, useMemo, useRef, useState } from "react"
import { monthNames, shortMonthNames, shortWeekDay, weekDays } from "~/functions/helpers/dates";
import { isNumber } from "~/functions/helpers/typechecks";
import { dates, joinClasses, log, useError } from "@functions";
import { Button, Checkbox, ErrorCard, NumberInput } from "@components";
import { visibleDayType } from "@types";
import { Arrow, CalendarSVG } from "@icons";

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
  const [ showCalendar, setShowCalendar ] = useState(false);

  function handleDateChange(date: Date | String) {
    const data = getCalendarDateParts(date);
    setCalendarData({ ...data })
  }
  function handleCalendarTypeChange(newType: string) {
    setInternalCalendarType(newType)
  }

  function handleShowCalendar() {
    setShowCalendar(prev => !prev);
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
    <div className={joinClasses('calendar__wrapper', className)} {...props}>
      <div className="calendar__inputs__icon">
        <CalendarInputs
          handleDateChange={handleDateChange}
          currentDate={calendarData.currentDate}
        />
        <Button className="icon" onClick={handleShowCalendar}><CalendarSVG /></Button>
      </div>

      {showCalendar && (
        <>
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
        </>
      )}
    </div>
  );
}


type CalendarInputsProps = {
  handleDateChange: (date: Date | String) => void;
  currentDate: Date;
  children?: React.ReactNode;
}

function CalendarInputs({ handleDateChange, currentDate, children }: CalendarInputsProps) {

  const { getCalendarDateParts } = useCalendar();
  const { daysInMonth, monthName } = getCalendarDateParts(currentDate)
  const { showError, handleError } = useError({
    day: false,
    month: false,
    year: false,
  });
  const ref = useRef<HTMLDivElement>(null);

  function handleInputValuechange() {
    console.log("handleInputValuechange func ran")
    if (!ref.current) return;

    const dateValues: Record<string, number> = {
      day: currentDate.getDate(),
      month: currentDate.getMonth(),
      year: currentDate.getFullYear()
    };

    [ 'day', 'month', 'year' ].forEach((name) => {
      const input = ref.current!.querySelector(`input[name="${name}"]`) as HTMLInputElement | null;

      if (input) {
        _validateValue(input, name);
      }
    });

    function _validateValue(element: HTMLInputElement, name: string) {
      const { max, min, value } = element;
      const parsedValue = parseInt(value, 10);
      const parsedMax = parseInt(max, 10);
      const parsedMin = parseInt(min, 10);
      let daysInMonth2 = 31

      if (isNumber(parsedMax) && parsedValue > parsedMax) {
        return _handleMax(name);
      }

      if (isNumber(parsedMin) && parsedValue < parsedMin) {
        return _handleMin(name);
      }

      dateValues[ name ] = parsedValue;
      if (name === 'month') {
        dateValues.month--;
      }

      function _handleMin(name: string) {
        if (name === 'day') {
          dateValues.month--
          if (dateValues.month < 0) {
            dateValues.month = 11;
            dateValues.year--;
          }
        }
        if (name === 'month') {
          dateValues.year--
        }
        dateValues.day = daysInMonth2;
      }

      function _handleMax(name: string) {
        if (name === 'day') {
          dateValues.month++
          if (dateValues.month > 11) {
            dateValues.month = 0;
            dateValues.year++;
          }
        }
        if (name === 'month') {
          dateValues.year++
        }
        dateValues.day = 1;
      }
    }
    const updatedDate = new Date(dateValues.year, dateValues.month, dateValues.day);
    handleDateChange(updatedDate);
  }

  function handleFocus(event: React.KeyboardEvent<HTMLInputElement>) {
    console.log("handleFocus func ran")

    const inputName = event.currentTarget.name;
    const currentEl = ref.current!.querySelector(`input[name="${inputName}"]`) as HTMLInputElement | null;
    if (!currentEl) return;

    switch (event.key) {
      case 'Tab':
        event.shiftKey ? _moveFocus(inputName, false) : _moveFocus(inputName);
        break;
      case 'Backspace':
        if (currentEl.value.length === 1) {
          console.log("happened")
          event.preventDefault(); // Prevent the default backspace behavior
          currentEl.value = '1';
          currentEl.dispatchEvent(new Event('change', { bubbles: true }));
          _moveFocus(inputName, false);
        }
        break;
      case 'ArrowLeft':
        if(currentEl.selectionStart === 0){
          _moveFocus(inputName, false);
        }
        break;
      case 'ArrowRight':
        if(currentEl.selectionStart === currentEl.value.length - 1){
          _moveFocus(inputName);
        }
        break;
      default:
        break;
    }


    function _moveFocus(currentFieldName: string, forwards: boolean = true) {
      const {prev, next} = getFieldsToFocus(currentFieldName);
      if (forwards && next){
        event.preventDefault();
        next.focus();
        next.setSelectionRange(0, 0)
      }
      if (!forwards && prev){
        event.preventDefault();
        prev.focus();
        prev.setSelectionRange(prev.value.length, prev.value.length)
      }
    }

    function getFieldsToFocus(currentFieldName: string) {
      const fieldOrder = ['day', 'month', 'year'];
      const select = (name: string) => ref.current!.querySelector(`input[name="${name}"]`) as HTMLInputElement | null;
      const currentIndex = fieldOrder.indexOf(currentFieldName);
      let prevFocusable, nextFocusable;
      if (currentIndex === 1) {
        prevFocusable = select('day');
        nextFocusable = select('year');
      }
      if (currentIndex === 0) {
        prevFocusable = null;
        nextFocusable = select('month');
      }
      if (currentIndex === 2) {
        prevFocusable = select('month');
        nextFocusable = null;
      }

      return {
        prev: prevFocusable,
        next: nextFocusable
      }
    }

  }
  function changeType(event: React.FocusEvent<HTMLInputElement> ){
    const currentEl = event.currentTarget
    const newType = currentEl.type === 'number' ? 'text' : 'number';
    currentEl.type = newType;
  }


  return (
    <div className="calendar__inputs" ref={ref}>
      <NumberInput
        aria-placeholder="dd"
        placeholder="dd"
        aria-label="day"
        aria-valuemin={1}
        aria-valuemax={daysInMonth}
        min={1}
        max={daysInMonth}
        maxLength={2}
        value={currentDate.getDate()}
        onChange={handleInputValuechange}
        onKeyDown={handleFocus}
        onBlur={changeType}
        onFocus={changeType}
        editable={true}
        formKey={"day"}
        showError={false}
        errorMessage={`Date can be between 1 and ${daysInMonth} (${monthName}).`}
      />
      <NumberInput
        aria-placeholder="MM"
        placeholder="MM"
        aria-label="month"
        aria-valuemin={1}
        aria-valuemax={12}
        maxLength={2}
        min={1}
        max={12}
        value={currentDate.getMonth() + 1}
        onChange={handleInputValuechange}
        onKeyDown={handleFocus}
        onBlur={changeType}
        onFocus={changeType}
        editable={true}
        formKey={"month"}
        showError={false}
        errorMessage={`Months can be between 1 and 12.`}
      />
      <NumberInput
        aria-placeholder="YYYY"
        placeholder="YYYY"
        aria-label="year"
        aria-valuemin={currentDate.getFullYear() - 10}
        aria-valuemax={currentDate.getFullYear() + 10}
        min={currentDate.getFullYear() - 10}
        max={currentDate.getFullYear() + 10}
        maxLength={4}
        value={currentDate.getFullYear()}
        onChange={handleInputValuechange}
        onKeyDown={handleFocus}
        onBlur={changeType}
        onFocus={changeType}
        editable={true}
        formKey={"year"}
        showError={false}
        errorMessage={`Please choose betwen ${currentDate.getFullYear() - 10} & ${currentDate.getFullYear() + 10}`}
      />
      {children}
    </div>
  )
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
  const { monthName } = getCalendarDateParts(currentDate);
  const actualMonth = monthNames[ new Date().getMonth() ];
  function handleMonthSelect(monthNumber: number) {
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