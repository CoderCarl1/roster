// import { TAppointment } from "@types";
import { useCallback, useEffect, useMemo, useState } from 'react';
// import Table, { Caption, TH } from "../table/table";
import React from 'react';
import { Button, LoadingComponent } from '@components';
import { useCalendarContext } from '~/contexts';
import { dates, log } from '~/functions';
import { useAppointments } from '../appointments';
import { displayTypeEnum } from '../appointments/Appointments';
import {
    CalendarDayType,
    CalendarMonthType,
    CalendarType,
    CalendarWeekType,
} from './useCalendar';
import { useCalendar } from '.';

type calendarDisplayTypes = 'day' | 'week' | 'month';
type mainProps = {
    displayType: calendarDisplayTypes;
    setLoading: (
        value:
            | boolean
            | React.SyntheticEvent<Element, Event>
            | React.MouseEvent<Element, MouseEvent>
    ) => boolean;
    loading: boolean;
    children?: React.ReactNode;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

export default function Main({
    displayType,
    setLoading,
    loading,
    children,
    ...props
}: mainProps) {
    const [ calendarData, setCalendarData ] = useState<CalendarType | null>(null);
    const {
        getAppointmentsForDay,
        getAppointmentsForWeek,
        getAppointmentsForMonth,
        appointmentsData,
    } = useAppointments();
    const { getDay, getWeek, getMonth } = useCalendar();
    const {
        currentDate,
        nextDay,
        nextWeek,
        nextMonth,
        prevDay,
        prevWeek,
        prevMonth,
    } = useCalendarContext();

    useEffect(() => {
        const setData = {
            day: () => {
                const appointments = getAppointmentsForDay(currentDate.date);
                const dayCalendarData = getDay(currentDate.date, appointments);
                setCalendarData(dayCalendarData);
            },
            week: () => {
                const sunday = dates.startOfWeek(currentDate.date);
                const appointments = getAppointmentsForWeek(sunday);
                const weekCalendarData = getWeek(sunday, appointments);
                setCalendarData(weekCalendarData);
            },
            month: () => {
                const appointments = getAppointmentsForMonth(currentDate.date);
                const monthCalendarData = getMonth(
                    currentDate.date,
                    appointments
                );
                setCalendarData(monthCalendarData);
            },
        };

        setData[ displayType ]();
        setLoading(false);
    }, [ displayType, currentDate.date ]);

    const handleNext = useCallback(() => {
        switch (displayType.toLowerCase()) {
            case 'day':
                nextDay();
                break;
            case 'week':
                nextWeek();
                break;
            case 'month':
                nextMonth();
                break;
            default:
                return null;
        }
    }, [ displayType, nextDay, nextWeek, nextMonth ]);

    const handlePrev = useCallback(() => {
        switch (displayType.toLowerCase()) {
            case 'day':
                prevDay();
                break;
            case 'week':
                prevWeek();
                break;
            case 'month':
                prevMonth();
                break;
            default:
                return null;
        }
    }, [ displayType, prevDay, prevWeek, prevMonth ]);

    const dateInformation = () => {
        let dateString = '';

        if (displayType === 'day')
            dateString += `${currentDate.dayName.slice(0, 3)} ${currentDate.day
                }`;
        if (displayType === 'week')
            dateString += `${currentDate.day} - ${currentDate.day + 6}`;
        dateString += ` ${currentDate.monthName}`;

        return dateString;
    };

    return (
        <section {...props}>
            <div className="calendar__controls">
                <span className="date__information">{dateInformation()}</span>
                <Button onClick={handlePrev}>prev</Button>
                <Button onClick={handleNext}>next</Button>
            </div>
            <div>{children}</div>

            {!calendarData || loading ? (
                <LoadingComponent />
            ) : (
                (displayType === 'day' && (
                    <DayCalendar dayData={calendarData as CalendarDayType} />
                )) ||
                (displayType === 'week' && (
                    <WeekCalendar weekData={calendarData as CalendarWeekType} />
                )) ||
                (displayType === 'month' && (
                    <MonthCalendar
                        monthData={calendarData as CalendarMonthType}
                    />
                ))
            )}
        </section>
    );
}

type dayProps = {
    dayData: CalendarDayType;
    weekView?: boolean;
};
type weekProps = {
    weekData: CalendarWeekType;
};
type monthProps = {
    monthData: CalendarMonthType;
};

function DayCalendar({ dayData, weekView = false }: dayProps) {
    const { data, dayNumber, date, dayName } = dayData;
    const appointmentSlotLength = data.reduce((obj, b) => {
        if (b.appointment?.id !== null && b.appointment?.id !== undefined) {
            obj[b.appointment.id] = {
                initial: (obj[b.appointment.id]?.initial ?? 0) + 1,
                available: (obj[b.appointment.id]?.available ?? 0) + 1,
              };
        }
        return obj;
    }, {} as Record<string, {initial: number, available: number}>);

    return (
        <div className="calendar__day long">
            {!weekView && <h3 className="calendar__day--name">{dayName} {dayNumber}</h3>}
            {data.map((slot) => {
                const isHour = slot.time.endsWith(":00");
                const isHalf = slot.time.endsWith(":30");
                const decorationWidth = isHour ? 0 : isHalf ? 3 : 1;
                const shouldShowAppointment = slot.appointment && appointmentSlotLength[slot.appointment.id].initial === appointmentSlotLength[slot.appointment.id].available--;;
              
                const slotStyles = {
                    '--decoration-width': `${decorationWidth}`,
                    '--slot-time': `'${isHour ? slot.time : ''}'`,
                    '--grid-rows': 1,
                };
                if (slot.appointment && shouldShowAppointment) {
                    slotStyles['--grid-rows'] =  appointmentSlotLength[slot.appointment.id].initial;
                }
                return (
                    <div 
                    className={`calendar__slot ${slot.appointment ? 'occupied' : 'unoccupied'}`} 
                    style={slotStyles} 
                    key={date + slot.time}>
                        {shouldShowAppointment && <span className="calendar__slot--appointment" >{slot.appointment?.fullAddress}</span>}
                    </div>
                );
            })}
        </div>
    );
}



function WeekCalendar({ weekData }: weekProps) {
    console.log({ weekData })
    return (
        <div className="calendar__week">
            <div className="weekday_initials">
                {[ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ].map((initial, idx) => (
                    <span className="initial" key={initial + idx}>
                        {initial}
                    </span>
                ))}
            </div>
            {weekData.map((day) =>
                <DayCalendar key={day.date.toString()} dayData={day} weekView={true} />
            )}
        </div>
    );
}

function CompressedDay({ dayData }: dayProps) {
    const { data, dayNumber, date, dayName } = dayData;

    const dataToRender = useMemo(() => {
        const updatedData = data.filter(
            (slot) =>
                (slot.appointment !== null || slot.appointment !== undefined) &&
                slot.appointment?.localTime?.start === slot.time
        );
        return updatedData;
    }, [ data ]);

    return (
        <div className="calendar__day compressed">
             <h2 className="compressed__date">{dayNumber}</h2>
            <div className="calendar__slots compressed">
                {dataToRender.map((slot) => {
                    return (
                        <span
                            className="calendar__slot compressed"
                            key={slot.time}
                        >
                            <span className="calendar__slot--time">{slot.time}</span>
                            <span className="calendar__slot--appointment">{slot.appointment?.fullAddress}</span>
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

function MonthCalendar({ monthData }: monthProps) {
    return (
        <div className="calendar__month">
            <div className="weekday_initials">
                {[ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ].map((initial, idx) => (
                    <span className="initial" key={initial + idx}>
                        {initial}
                    </span>
                ))}
            </div>
            {monthData.length
                ? monthData.map((week: CalendarWeekType, idx) => {
                    return (
                        <div
                            key={idx + week[ idx ].date.toString()}
                            className="calendar__week"
                        >
                            {week.map((day: CalendarDayType) => (
                                <CompressedDay key={day.date.toString()} dayData={day} />
                            ))}
                        </div>
                    );
                })
                : null}
        </div>
    );
}
