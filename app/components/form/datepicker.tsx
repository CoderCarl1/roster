import React, { useEffect, useMemo, useState } from 'react';
import {
    Button,
    NumberInput,
    Row,
    TD,
    TH,
    Table,
    TableHead,
} from '@components';
import { dates, useClickOutside, useToggle } from '@functions';
import { isNumber } from '~/functions/helpers/typechecks';
import useError from '~/functions/helpers/useError';
import CalendarSVG from '~/icons/calendar';

type props = {
    startingDate?: Date;
    cb: (arg: any) => unknown | void;
    calendarType?: 'day' | 'week' | 'month';
    className: string;
} & React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
>;

export default function DateTimePicker({
    startingDate,
    cb,
    calendarType = 'day',
    className = '',
    ...props
}: props) {
    // Date Stuff
    const [datePickerShown, setDatePickerShown] = useState(false);

    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(
        startingDate ? new Date(startingDate) : today
    );
    const [currentDate, setCurrentDate] = useState({
        day: selectedDate.getDay(),
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear(),
    });
    const [showMonths, setshowMonths] = useState(false);
    const calendarRef = useClickOutside({
        cb: showDatePicker,
        checkBeforeRunningCB: [datePickerShown],
    }) as React.RefObject<HTMLDivElement>;
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
        const dateParts: Record<string, number> = {
            day: currentDate.day,
            month: currentDate.month,
            year: currentDate.year,
        };
        console.log('dateParts old ', dateParts);
        dateParts[e.currentTarget.name] = parseInt(e?.currentTarget.value, 10);
        console.log('dateParts new ', dateParts);
        setDateStatesFromDate(
            new Date(dateParts.year, dateParts.month, dateParts.day)
        );
    }
    function handleMonthGridView() {
        setshowMonths((prev) => !prev);
    }
    // function handleMonthSelect(monthNumber: number) {
    //   handleMonthGridView();
    //   setDateStatesFromDate(new Date(currentDate.year, monthNumber, currentDate.day))
    // }

    function setDateStatesFromDate(date: Date) {
        console.log('setDateStatesFromDate', date);
        setCurrentDate({
            day: dates.dayNumberFromDate(date),
            month: dates.getMonthNumberFromDate(date),
            year: date.getFullYear(),
        });
        cb(date);
    }

    function showDatePicker() {
        setDatePickerShown((prev) => !prev);
    }

    // function handleTimeSelect() {}
    // function handleDayChange(newDay: string) {}
    return (
        <div className={`dateTimePicker--wrapper ` + className} {...props}>
            <Button className="no-border" onClick={showDatePicker}>
                <CalendarSVG />
            </Button>
            {datePickerShown ? (
                <div className="date-picker" ref={calendarRef}>
                    <InputDate
                        cb={setDateStatesFromDate}
                        day={selectedDate.getDate()}
                        month={selectedDate.getMonth() + 1}
                        year={selectedDate.getFullYear()}
                        showMonthGrid={handleMonthGridView}
                    />
                    <div className="calendar--wrapper">
                        <PickerCalendar
                            date={selectedDate}
                            cb={handleCalendarSelect}
                            calendarType={calendarType}
                        />
                        {showMonths ? (
                            <MonthSelect
                                date={selectedDate}
                                cb={handleCalendarSelect}
                            />
                        ) : null}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

function InputTime() {
    return (
        <>
            <span>TIME</span>
        </>
    );
}

function PickerTime() {
    return <div className="picker__time">time goes here</div>;
}

type pickerCalendarProps = {
    date: Date;
    cb: (date?: Date) => unknown | void;
    calendarType: 'day' | 'week' | 'month';
} & React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
>;

function PickerCalendar({
    date,
    cb,
    calendarType,
    ...props
}: pickerCalendarProps) {
    if (calendarType === 'day') {
        console.log('day picker');
        return <DaySelect date={date} cb={cb} {...props} />;
    }

    if (calendarType === 'week') {
        console.log('week picker');
        return <WeekSelect date={date} cb={cb} {...props} />;
    }

    if (calendarType === 'month') {
        console.log('month picker');
        return <MonthSelect date={date} cb={cb} {...props} />;
    }
    return null;
}

type inputDateProps = {
    day: number;
    month: number;
    year: number;
    cb: (date: Date) => unknown;
    showMonthGrid: () => void;
};

function InputDate({ day, month, year, cb, showMonthGrid }: inputDateProps) {
    const daysInMonth = useMemo(() => {
        return dates.getDaysInMonth(year, month - 1);
    }, [year, month]);

    const monthName = useMemo(() => {
        return dates.getMonthNameByNumber(month - 1);
    }, [month]);
    const { showError, handleError } = useError({
        day: false,
        month: false,
        year: false,
    });

    function handleInputValuechange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const maxLength = event.currentTarget.maxLength;
        const length = event.currentTarget.value.length;
        const { min, max } = event.currentTarget.dataset;
        const value = event.currentTarget.value;
        const inputName = event.currentTarget.name;

        // remove error message when user changes input
        if (showError[inputName]) {
            handleError(inputName);
        }
        if (maxLength && length > maxLength) {
            handleError(inputName);
            event.currentTarget.value = value.slice(0, maxLength);
        }
        const valueAsNumber = parseInt(value, 10) || 0;
        if (min !== undefined && isNumber(valueAsNumber)) {
            const minAsNumber =
                typeof min === 'string' ? parseInt(min, 10) : min;
            if (valueAsNumber < minAsNumber && inputName === 'day') {
                event.currentTarget.value = `${daysInMonth}`;
                month = month--;
                if (month < 0) {
                    month = 11;
                    year = year--;
                }
            }
        }

        if (max !== undefined && isNumber(valueAsNumber)) {
            const maxAsNumber =
                typeof max === 'string' ? parseInt(max, 10) : max;
            if (valueAsNumber > maxAsNumber && inputName === 'day') {
                event.currentTarget.value = '1';
                month = month++;
                if (month > 11) {
                    month = 1;
                    year = year++;
                }
            }
        }
        const dateParts: Record<string, number> = {
            day: day,
            month: month,
            year: year,
        };

        dateParts[inputName] = parseInt(event?.currentTarget.value, 10);
        cb(new Date(dateParts.year, dateParts.month - 1, dateParts.day));
    }

    return (
        <div className="input__date">
            {/* TODO: make the day input disabled when month view */}
            <NumberInput
                label="day"
                value={day}
                formKey="day"
                editable={true}
                onChangeFunc={handleInputValuechange}
                maxLength={2}
                data-min={1}
                data-max={daysInMonth}
                showError={showError.day}
                errorMessage={`Date can be between 1 and ${daysInMonth} (${monthName}).`}
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
                errorMessage="Limit reached. Max of 4 characters"
            />
        </div>
    );
}

type daySelectProps = {
    date: Date;
    cb: (selectedDate: Date) => unknown;
    className: string;
} & React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
>;

function DaySelect({ date, cb, className = '', ...props }: daySelectProps) {
    const month = date && dates.getVisibleDayNumbersInArray(date);
    const weekDayInitials = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <Table className="calendar__selection--days month" {...props}>
            {weekDayInitials.map((initial, idx) => (
                <TH className="initial" key={initial + idx + 'date-picker'}>
                    {initial}
                </TH>
            ))}
            {month.length
                ? month.map((week, weekIndex) => {
                      return (
                          <Row
                              key={weekIndex + 'date-picker'}
                              className="calendar__selection--days week"
                          >
                              {week.map((day, dayIndex) => {
                                  let dayClasses = '';

                                  if (!day.inMonth) {
                                      dayClasses += ' notInMonth';
                                  }
                                  if (date.toString() === day.date.toString()) {
                                      dayClasses += ' selected';
                                  }

                                  return (
                                      <TD
                                          key={
                                              day.number + weekIndex + dayIndex
                                          }
                                          className={
                                              'calendar__selection--days day' +
                                              dayClasses
                                          }
                                      >
                                          <Button onClick={() => cb(day.date)}>
                                              {day.number}
                                          </Button>
                                      </TD>
                                  );
                              })}
                          </Row>
                      );
                  })
                : null}
        </Table>
    );
}

type weekSelectProps = {
    date: Date;
    cb: (selectedDate: Date) => unknown;
    className: string;
} & React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
>;

function WeekSelect({ date, cb, className = '', ...props }: weekSelectProps) {
    const month = date && dates.getVisibleDayNumbersInArray(date);
    const startOfWeek = dates.startOfWeek(date);
    const endOfWeek = dates.endOfWeek(date);
    console.log('startOfWeek', startOfWeek);
    console.log('endOfWeek', endOfWeek);
    console.log('date', date);
    const weekDayInitials = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    function handleWeekSelect(date: Date) {
        cb(date);
    }

    return (
        <div className="calendar__selection--weeks month" {...props}>
            <div className="weekday_initials">
                {weekDayInitials.map((initial, idx) => (
                    <span
                        className="initial"
                        key={initial + idx + 'date-picker'}
                    >
                        {initial}
                    </span>
                ))}
            </div>
            {month.length
                ? month.map((week, weekIndex) => {
                      const comparisonDate = week[0].date;
                      let weekClasses = '';

                      if (
                          comparisonDate === startOfWeek ||
                          comparisonDate === endOfWeek ||
                          (comparisonDate < endOfWeek &&
                              comparisonDate > startOfWeek)
                      ) {
                          weekClasses += ' selected';
                      }
                      return (
                          <Button
                              key={weekIndex + 'date-picker'}
                              className={
                                  'calendar__selection--weeks week week-btn' +
                                  weekClasses
                              }
                              onClick={() => handleWeekSelect(week[0].date)}
                          >
                              {week.map((day, dayIndex) => {
                                  // TODO: get class to say day is not in month
                                  return (
                                      <span
                                          key={
                                              day.number + weekIndex + dayIndex
                                          }
                                          className="calendar__selection--weeks day"
                                      >
                                          {day.number}
                                      </span>
                                  );
                              })}
                          </Button>
                      );
                  })
                : null}
        </div>
    );
}

type monthSelectProps = {
    date: Date;
    cb: (selectedDate: Date) => unknown;
    className: string;
} & React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
>;

function MonthSelect({ date, cb, className = '', ...props }: monthSelectProps) {
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    const currentMonthName = useMemo(() => {
        return monthNames[date.getMonth()];
    }, [date]);

    function handleMonthSelect(monthNumber: number) {
        const updatedDate = new Date(date.getFullYear(), monthNumber, 1);
        cb(updatedDate);
    }

    return (
        <div className={'calendar__selection--month' + className} {...props}>
            {monthNames.map((month, idx) => {
                if (month === currentMonthName) {
                    return (
                        <Button
                            key={'month-grid' + idx}
                            className="month current"
                            onClick={() => handleMonthSelect(idx)}
                        >
                            {month}
                        </Button>
                    );
                }
                return (
                    <Button
                        key={'month-grid' + idx}
                        className="month"
                        onClick={() => handleMonthSelect(idx)}
                    >
                        {month}
                    </Button>
                );
            })}
        </div>
    );
}
