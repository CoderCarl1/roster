import React, { useMemo, useState } from "react";
import { dates, useClickOutside, useToggle } from "@functions";
import { Button, NumberInput } from "@components";
import CalendarSVG from "~/icons/calendar";
import { isNumber } from "~/functions/helpers/typechecks";
import useError from "~/functions/helpers/useError";

type props = {
  startingDate?: Date;
}


export default function DateTimePicker({ startingDate }: props) {
  // Date Stuff
  const [ datePickerShown, setDatePickerShown ] = useState(false);

  const today = new Date();
  const [ selectedDate, setSelectedDate ] = useState(startingDate ? new Date(startingDate) : today);
  const [ currentDate, setCurrentDate ] = useState({
    day: selectedDate.getDay(),
    month: selectedDate.getMonth() + 1,
    year: selectedDate.getFullYear()
  })
  const [showMonths, setshowMonths] = useState(false)
  const calendarRef = useClickOutside({ cb: showDatePicker, checkBeforeRunningCB: [ datePickerShown ] }) as React.RefObject<HTMLDivElement>;
  // Time Stuff
  // const [ time, setTime ] = useState(monthDate ? new Date(monthDate) : today);

  function handleMonthGridView(){
    setshowMonths(prev => !prev);
  }

  function handleCalendarSelect(date?: Date) {
    if (date) {
      const parsedDate = dates.parseDate(date);
      setSelectedDate(parsedDate);
      setDateStatesFromDate(parsedDate);
    }
    showDatePicker();
  }
  // ChangeEventHandler<HTMLInputElement>
  function handleDateChange(e?: React.ChangeEvent<HTMLInputElement>) {
    if (!e || !e.currentTarget) return;
    const dateParts: Record<string, number> = {
      day: currentDate.day,
      month: currentDate.month,
      year: currentDate.year,
    }
    dateParts[ e.currentTarget.name ] = parseInt(e?.currentTarget.value, 10);

    setDateStatesFromDate(new Date(dateParts.year, dateParts.month, dateParts.day))
  }

  function handleMonthSelect(monthNumber: number){
    handleMonthGridView();
    console.log("clicked a month")
    console.log("clicked index", monthNumber)
  }

  function setDateStatesFromDate(date: Date) {
    setCurrentDate({
      day: +dates.dayNumberFromDate(date),
      month: +dates.getMonthNumberFromDate(date),
      year: date.getFullYear()
    });
  }

  function showDatePicker() {
    setDatePickerShown((prev) => !prev);
  }

  function handleTimeSelect() {

  }
  function handleDayChange(newDay: string) {


  }
  return (
    <div className="dateTimePicker--wrapper">
      <Button className="no-border" onClick={showDatePicker}><CalendarSVG /></Button>
      {/* <p>{currentDate.day} - {currentDate.month} - {currentDate.year}</p> */}
      {/* <InputTime />
      <hr />
      <PickerTime /> */}
      {datePickerShown && (
        <div className="date-picker" ref={calendarRef}>
          <InputDate
            handleDateChange={handleDateChange}
            day={currentDate.day}
            month={currentDate.month}
            year={currentDate.year}
            showMonthGrid={handleMonthGridView}
          />
          <div className="calendar--wrapper">
          <PickerCalendar date={selectedDate} handleCalendarSelect={handleCalendarSelect} />
          {showMonths && <MonthSelect currentMonth={currentDate.month} handleMonthSelect={handleMonthSelect} />}
          </div>
        </div>
      )}
    </div>

  )
}

function InputTime() {
  return (
    <>
      <span>TIME</span>
    </>
  )
}

function PickerTime() {
  return (
    <div className="picker__time">time goes here</div>
  )
}

type pickerCalendarProps = {
  date: Date;
  handleCalendarSelect: (date?: Date) => void;
}
function PickerCalendar({ date, handleCalendarSelect }: pickerCalendarProps) {

  return (
    <div className="picker__calendar">
      <div className="weekday_initials">
        {[ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ].map((initial, idx) => (
          <span className="initial" key={initial + idx}>
            {initial}
          </span>
        ))}
      </div>
      <>
        {date && dates.getVisibleDayNumbersInArray(date).map((week, weekIndex) => {

          return (
            <div
              key={weekIndex + 'date-picker'}
              className="picker__calendar--week">
              {
                week.map((day, idx) => {
                  let dayClasses = '';

                  if (!day.inMonth) {
                    dayClasses += ' notInMonth';
                  }
                  if (date.toString() === day.date.toString()) {
                    dayClasses += ' selected';
                  }

                  return (
                    <Button
                      className={"picker__calendar--day" + dayClasses}
                      key={day.number + weekIndex + idx}
                      onClick={() => handleCalendarSelect(day.date)}>
                      {day.number}
                    </Button>)
                })
              }
            </div>
          )

        })}
      </>
    </div>
  )
}

type inputDateProps = {
  day: number;
  month: number;
  year: number;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showMonthGrid: () => void;
}

function InputDate({ day, month, year, handleDateChange, showMonthGrid }: inputDateProps) {
  const daysInMonth = useMemo(() => {
    return dates.getDaysInMonth(year, month - 1)
  }, [ year, month ]);

  const monthName = useMemo(() => {
    return dates.getMonthNameByNumber(month - 1)
  }, [ month ])
  const { showError, handleError } = useError({ day: false, month: false, year: false });

  function handleInputValuechange(event: React.ChangeEvent<HTMLInputElement>) {
    const { min = 0, max, maxLength } = event.currentTarget;
    const length = event.currentTarget.value.length;
    let value = event.currentTarget.value;
    const inputName = event.currentTarget.name;

    // remove error message when user changes input
    if (showError[ inputName ]) {
      handleError(inputName)
    }

    if (maxLength && length > maxLength) {
      handleError(inputName)
      event.currentTarget.value = value.slice(0, maxLength);
    }
    const valueAsNumber = parseInt(value, 10) || 0;
    if (min !== undefined && isNumber(valueAsNumber)) {
      const minAsNumber = typeof min === 'string' ? parseInt(min, 10) : min;
      if (valueAsNumber < minAsNumber) {
        event.currentTarget.value = `0`;
      }
    }

    if (max !== undefined && isNumber(valueAsNumber)) {
      const maxAsNumber = typeof max === 'string' ? parseInt(max, 10) : max;
      if (valueAsNumber > maxAsNumber) {
        event.currentTarget.value = max;
      }
    }

    handleDateChange(event);
  }
console.log("InputDate month", month)

  return (
    <div className="input__date">
      <NumberInput
        label="day"
        value={day}
        formKey="day"
        editable={true}
        onChangeFunc={handleInputValuechange}
        maxLength={2}
        min={0}
        max={daysInMonth}
        showError={showError.day}
        errorMessage={`Please enter a value between 1 and ${daysInMonth} (${monthName}).`}
      />
      <Button onClick={showMonthGrid}>{monthName}</Button>
      <NumberInput
        label="year"
        value={year}
        formKey="year"
        editable={true}
        onChangeFunc={handleInputValuechange}
        maxLength={4}
        min={1}
        showError={showError.year}
        errorMessage='Limit reached. Max of 4 characters'
      />
    </div>
  )
}

type monthSelectProps = {
  currentMonth: number
  handleMonthSelect: (monthNumber: number) => void;
} & React.HTMLProps<HTMLDivElement>

function MonthSelect({ currentMonth, handleMonthSelect, className = '', ...props }: monthSelectProps) {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const currentMonthName = useMemo(() => {
    console.log("current index is ", currentMonth)
    console.log("cuyrrent month name is ", monthNames[ currentMonth - 1 ])
    return monthNames[ currentMonth - 1 ];
  }, [currentMonth])

  return (
        <div className={"calendar__selection--month" + className} {...props}>
          {monthNames.map((month, idx) => {
            if (month === currentMonthName) {
              return <Button id={`month:${month}-${idx}`} key={'month-grid' + idx} className="month current" onClick={() => handleMonthSelect(idx)}>{month}</Button>
            }
            return <Button id={`month:${month}-${idx}`} key={'month-grid' + idx} className="month" onClick={() => handleMonthSelect(idx)}>{month}</Button>
          })}
        </div>
  )
}