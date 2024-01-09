import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Button,
    NumberInput,
    Row,
    TD,
    TH,
    Table,
} from '@components';
import { dates, useCaptureFocus, useClickOutside, useToggle } from '@functions';
import { isNumber } from '~/functions/helpers/typechecks';
import useError from '~/functions/helpers/useError';
import CalendarSVG from '~/icons/calendar';
import { monthNames, shortMonthNames, shortWeekDay, weekDays } from '~/functions/helpers/dates';

type props = {
    startingDate?: Date;
    cb: (arg: any) => unknown | void;
    calendartype?: 'day' | 'week' | 'month';
    className?: string;
} & React.JSX.IntrinsicElements[ "div" ];

// React.DetailedHTMLProps<
//     React.HTMLAttributes<HTMLDivElement>,
//     HTMLDivElement
// >;

export default function DateTimePicker({
    startingDate,
    cb,
    calendartype = 'day',
    className = '',
    ...props
}: props) {
    // Date Stuff
    const [ datePickerShown, setDatePickerShown ] = useState(false);

    const today = new Date();
    const [ selectedDate, setSelectedDate ] = useState(
        startingDate ? new Date(startingDate) : today
    );
    const [ currentDate, setCurrentDate ] = useState({
        day: selectedDate.getDay(),
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear(),
    });
    const [ showMonths, setshowMonths ] = useState(false);
    const calendarRef = useClickOutside({
        cb: showDatePicker,
        checkBeforeRunningCB: [ datePickerShown ],
    }) as React.RefObject<HTMLDivElement>;
    // Time Stuff
    // const [ time, setTime ] = useState(monthDate ? new Date(monthDate) : today);

    function handleCalendarSelect(date?: Date, closePicker = true) {
        if (date) {
            const parsedDate = dates.parseDate(date);
            setSelectedDate(parsedDate);
            setDateStatesFromDate(parsedDate);
        }
        if (closePicker) {
            console.log("handleCalendarSelect")
            showDatePicker();
        }
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
        dateParts[ e.currentTarget.name ] = parseInt(e?.currentTarget.value, 10);
        console.log('dateParts new ', dateParts);
        setDateStatesFromDate(
            new Date(dateParts.year, dateParts.month, dateParts.day)
        );
    }

    function handleMonthGridView() {
        setshowMonths((prev) => !prev);
    }
    function handleMonthSelect(date: Date) {
        const closePicker = calendartype === 'month';
        handleMonthGridView();
        handleCalendarSelect(date, closePicker)
    }

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

    return (
        <div className={`dateTimePicker--wrapper ` + className} {...props}>
            <Button className={datePickerShown ? "no-pointer-events" : ""} onClick={showDatePicker} aria-controls='datePicker' aria-expanded={`${datePickerShown}`}>
                <CalendarSVG />
            </Button>
            <div className="modal-wrapper">
                <div className={`date-picker${datePickerShown ? "" : " visually-hidden"}`}
                    id="datePicker"
                    ref={calendarRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label='Choose Date'
                >
                    <InputDate
                        cb={setDateStatesFromDate}
                        day={selectedDate.getDate()}
                        month={selectedDate.getMonth() + 1}
                        year={selectedDate.getFullYear()}
                        showMonthGrid={handleMonthGridView}
                        calendartype={calendartype}
                    />
                    <div className="calendar--wrapper">
                        <PickerCalendar
                            date={selectedDate}
                            cb={handleCalendarSelect}
                            handleMonthGridView={handleMonthGridView}
                            calendartype={calendartype}
                        />
                        {showMonths ? (
                            <MonthSelect
                                date={selectedDate}
                                cb={handleMonthSelect}
                                handleMonthGridView={handleMonthGridView}
                            />
                        ) : null}
                    </div>
                    <div className="dialog-ok-cancel-group">
                        <Button className="dialog-button" onClick={showDatePicker}>Cancel</Button>
                        <Button className="dialog-button">OK</Button>
                    </div>
                    <div className="dialog-message" aria-live="polite">Cursor keys can navigate dates</div>
                </div>
            </div>

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
    handleMonthGridView: () => void;
    calendartype: 'day' | 'week' | 'month';
} & React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
>;

function PickerCalendar({
    date,
    cb,
    handleMonthGridView,
    calendartype,
    ...props
}: pickerCalendarProps) {
    if (calendartype === 'day') {
        return <DaySelect date={date} cb={cb} {...props} />;
    }

    if (calendartype === 'week') {
        return <WeekSelect date={date} cb={cb}  {...props} />;
    }

    if (calendartype === 'month') {
        return <MonthSelect date={date} cb={cb} handleMonthGridView={handleMonthGridView} {...props} />;
    }
    return null;
}

type inputDateProps = {
    day: number;
    month: number;
    year: number;
    cb: (date: Date) => unknown;
    showMonthGrid: () => void;
    calendartype: 'day' | 'week' | 'month',
} & React.JSX.IntrinsicElements[ "div" ];

function InputDate({ day, month, year, cb, showMonthGrid, ...props }: inputDateProps) {
    const daysInMonth = useMemo(() => {
        return dates.getDaysInMonth(year, month - 1);
    }, [ year, month ]);

    const monthName = useMemo(() => {
        return dates.getMonthNameByNumber(month - 1);
    }, [ month ]);
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
        if (showError[ inputName ]) {
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

        dateParts[ inputName ] = parseInt(event?.currentTarget.value, 10);
        cb(new Date(dateParts.year, dateParts.month - 1, dateParts.day));
    }

    return (
        <div className="input__date" {...props}>
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
    className?: string;
} & React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
>;

function DaySelect({ date, cb, className = '', ...props }: daySelectProps) {
    const month = date && dates.getVisibleDayNumbersInArray(date);

    return (
        <table className="calendar__selection--days month" aria-labelledby='days_selector--caption' tabIndex={0} {...props}>
            <caption className='visually-hidden' id="days_selector--caption">days within {dates.getMonthName(date)}</caption>
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
                {month.length && month.map((week, weekIndex) => {
                    return (
                        <tr
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
                                    <td
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
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

type weekSelectProps = {
    date: Date;
    cb: (selectedDate: Date) => unknown;
    className?: string;
} & React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
>;

function WeekSelect({ date, cb, className = '', ...props }: weekSelectProps) {
    const month = date && dates.getVisibleDayNumbersInArray(date);
    const startOfWeek = dates.startOfWeek(date);
    const endOfWeek = dates.endOfWeek(date);

    function handleWeekSelect(date: Date) {
        cb(date);
    }

    return (
        <table className="calendar__selection--weeks month" aria-labelledby='week_selector--caption' tabIndex={0} {...props} >
            <caption className='visually-hidden' id="week_selector--caption">Weeks within {dates.getMonthName(date)}</caption>
            <thead>
                <tr className="weekday_initials">
                    {shortWeekDay.map((initial, idx) => (
                        <th
                            className="initial"
                            key={initial + idx + 'date-picker'}
                            abbr={weekDays[ idx ]}
                        >
                            {initial}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {month.length && month.map((week, weekIndex) => {
                        const comparisonDate = week[ 0 ].date;
                        let weekClasses = '';

                        if (
                            comparisonDate.toLocaleDateString() === startOfWeek.toLocaleDateString() ||
                            comparisonDate.toLocaleDateString() === endOfWeek.toLocaleDateString() ||
                            (comparisonDate < endOfWeek &&
                                comparisonDate > startOfWeek)
                        ) {
                            weekClasses += ' selected';
                        }
                        return (
                            <tr key={weekIndex + 'date-picker'}>
                                <td>
                                    <Button

                                        className={
                                            'calendar__selection--weeks week week-btn' +
                                            weekClasses
                                        }

                                        onClick={() => handleWeekSelect(week[ 0 ].date)}
                                    >
                                        <p className='visually-hidden'>from {dates.humanReadable(week[ 0 ].date)} to {dates.humanReadable(week[ 6 ].date)}</p>
                                        {week.map((day, dayIndex) => {
                                            let dayClasses = '';
                                            if (!day.inMonth) {
                                                dayClasses += ' notInMonth';
                                            }

                                            return (
                                                <span
                                                    key={
                                                        day.number + weekIndex + dayIndex
                                                    }
                                                    aria-hidden="true"
                                                    className={"calendar__selection--weeks day" + 
                                                                dayClasses}
                                                >
                                                    {day.number}
                                                </span>
                                            );
                                        })}
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
}

type monthSelectProps = {
    date: Date;
    cb: (selectedDate: Date) => unknown;
    handleMonthGridView: () => void;
    className?: string;
} & React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
>;

function MonthSelect({ date, cb, handleMonthGridView, className = '', ...props }: monthSelectProps) {

    const [ selectedDate, setSelectedDate ] = useState(date ? date : new Date());

    const monthRef = useCaptureFocus<HTMLTableElement>({ cb: handleMonthGridView });
    const timeoutRef = useRef<NodeJS.Timeout>()
    const currentMonthName = useMemo(() => {
        return monthNames[ date.getMonth() ];
    }, [ date ]);

    function handleMonthSelect(monthNumber: number) {
        const updatedDate = new Date(date.getFullYear(), monthNumber, 1);
        setSelectedDate(updatedDate);
        if (monthRef.current !== null) {
            console.log("toggling class")
            monthRef.current.classList.toggle('fadeout')
        }
        timeoutRef.current = setTimeout(() => {
            cb(selectedDate);
        }, 250)
    }

    useEffect(() => {
        if (monthRef.current) {
            monthRef.current.focus();
        }
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [])

    return (
        <table ref={monthRef} className={'calendar__selection--month' + className} role="region" aria-labelledby="months--selector_caption" tabIndex={0} {...props}>
            <caption className="visually-hidden" id="months--selector_caption">Months</caption>
            <tbody>
                {monthNames.map((month, idx) => {
                    if (month === currentMonthName) {
                        return (
                            <Button
                                key={'month-grid' + idx}
                                className="month current"
                                onClick={() => handleMonthSelect(idx)}
                                aria-label={month}
                            >
                                {shortMonthNames[idx]}
                            </Button>
                        );
                    }
                    return (
                        <Button
                            key={'month-grid' + idx}
                            className="month"
                            onClick={() => handleMonthSelect(idx)}
                        >
                            {shortMonthNames[idx]}
                        </Button>
                    );
                })}
            </tbody>
        </table>
    );
}
