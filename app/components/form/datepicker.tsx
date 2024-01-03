import React, { useState } from "react";
import { dates, useToggle, useClickOutside } from "@functions";
import { Button, Form, Input } from "@components";
import CalendarSVG from "~/icons/calendar";

type props = {
  monthDate?: Date;
}


export default function DateTimePicker({ monthDate }: props) {
  // Date Stuff
  const [ datePickerShown, setDatePickerShown ] = useState(false);

  const today = new Date();
  const [ selectedDate, setSelectedDate ] = useState(monthDate ? new Date(monthDate) : today);
  const [ currentDate, setCurrentDate ] = useState({
    day: selectedDate.getDay(),
    month: selectedDate.getMonth() + 1,
    year: selectedDate.getFullYear()
  })
  const calendarRef = useClickOutside({ cb: showDatePicker, checkBeforeRunningCB: [ datePickerShown ] }) as React.RefObject<HTMLDivElement>;
  // Time Stuff
  // const [ time, setTime ] = useState(monthDate ? new Date(monthDate) : today);


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
    setCurrentDate({...currentDate, [e.currentTarget.name]: e?.currentTarget.value})
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
      <p>{currentDate.day} - {currentDate.month} - {currentDate.year}</p>
      <InputTime />
      <hr />

      <PickerTime />
      {datePickerShown && (
        <div className="date-picker" ref={calendarRef}>
          <InputDate
            handleDateChange={handleDateChange}
            day={currentDate.day}
            month={currentDate.month}
            year={currentDate.year}
          />
          <PickerCalendar date={selectedDate} handleCalendarSelect={handleCalendarSelect} />
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
      <div>
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
      </div>
    </div>
  )
}

type inputDateProps = {
  day: number;
  month: number;
  year: number;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
function InputDate({ day, month, year, handleDateChange }: inputDateProps) {
  return (
    <div className="select__date">
      <Input
        label="Day"
        value={day}
        type='number'
        formKey="Day"
        editable={true}
        onChangeFunc={handleDateChange}
        maxLength={2}
        min={1}
        max={dates.getDaysInMonth(year, month - 1)}
      />
      <Input
        label={"month"}
        value={month}
        type='number'
        formKey="month"
        editable={true}
        onChangeFunc={handleDateChange}
        maxLength={2}
        min={1}
        max={12}
      />
      <Input
        label={"year"}
        value={year}
        type='number'
        formKey="year"
        editable={true}
        onChangeFunc={handleDateChange}
        maxLength={4}
        min={1}
      />
    </div>
  )
}