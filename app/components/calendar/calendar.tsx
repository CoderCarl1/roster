// import { TAppointment } from "@types";
import { useCalendar } from ".";
import { useAppointments } from "../appointments";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCalendarContext } from "~/contexts";
import { CalendarDayType, CalendarMonthType, CalendarType, CalendarWeekType } from "./useCalendar";
// import Table, { Caption, TH } from "../table/table";
import { Button, LoadingComponent } from '@components';
import { dates, log } from "~/functions";
import React from "react";
import { displayTypeEnum } from "../appointments/Appointments";

type calendarDisplayTypes = 'day' | 'week' | 'month';
type mainProps = {
  displayType: calendarDisplayTypes;
  setLoading: (value: boolean | React.SyntheticEvent<Element, Event> | React.MouseEvent<Element, MouseEvent>) => boolean;
  loading: boolean;
  children?: React.ReactNode;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;


export default function Main({ displayType, setLoading, loading, children, ...props }: mainProps) {
  const [ calendarData, setCalendarData ] = useState<CalendarType | null>(null);
  const { getAppointmentsForDay, getAppointmentsForWeek, getAppointmentsForMonth, appointmentsData } = useAppointments();
  const { getDay, getWeek, getMonth } = useCalendar();
  const { currentDate, nextDay, nextWeek, nextMonth, prevDay, prevWeek, prevMonth } = useCalendarContext();

  

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
        const monthCalendarData = getMonth(currentDate.date, appointments);
        setCalendarData(monthCalendarData);
      }
    }

    setData[ displayType ]();
    setLoading(false);
  }, [ displayType, currentDate.date ])

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

    if (displayType === 'day') dateString += `${currentDate.dayName.slice(0, 3)} ${currentDate.day}`;
    if (displayType === 'week') dateString += `${currentDate.day} - ${currentDate.day + 6}`;
    dateString += ` ${currentDate.monthName}`;

    return dateString;
  };


  return (
    <section {...props}>
      <div className="calendar__controls">
        <span className="date__information">{dateInformation()}</span>
       {children}
        <Button onClick={handlePrev}>prev</Button><Button onClick={handleNext}>next</Button></div>

      {!calendarData || loading ? (
        <LoadingComponent />
      ) : (
        displayType === 'day' && <DayCalendar dayData={calendarData as CalendarDayType} /> ||
        displayType === 'week' && <WeekCalendar weekData={calendarData as CalendarWeekType} /> ||
        displayType === 'month' && <MonthCalendar monthData={calendarData as CalendarMonthType} />
      )}
    </section>
  )
}

type dayProps = {
  dayData: CalendarDayType;
}
type weekProps = {
  weekData: CalendarWeekType
}
type monthProps = {
  monthData: CalendarMonthType
}

function DayCalendar({ dayData }: dayProps) {
  const { data, dayName } = dayData;

  return (
    <div className="calendar__day">
      <h3>{dayName && dayName}</h3>

      {data.length && data.map((slot, idx) => (
        <div key={idx + slot.time}>
          Time: {slot.time}, Appointment ID: {slot.appointment?.id}
        </div>
      ))}
    </div>
  );
}

function WeekCalendar({ weekData }: weekProps) {
  return (
    <div className="calendar__week">
      <div className="weekday_initials">
        {[ "S", "M", "T", "W", "T", "F", "S" ].map((initial, idx) => <span className="initial" key={initial + idx}>{initial}</span>)}
      </div>
      {weekData.map(day => (
        <div key={day.date.toString()} className="calendar__day">
          {day.data.length && day.data.map((slot, idx) => (
            <div key={idx + slot.time}>
              Time: {slot.time}, Appointment ID: {slot.appointment?.id}
            </div>
          ))}
        </div>
      ))}
      {/* {weekData.map(({data}) => (
          <div key={idx + data.time}>
            Time: {data.time}, Appointment ID: {data.appointment?.id}
          </div>
      ))} */}
    </div>
  );
}


function CompressedDay({ date, data }: CalendarDayType) {

  const dataToRender = useMemo(() => {
    return data.filter(slot => (slot.appointment !== null || slot.appointment !== undefined) && slot.appointment?.start === slot.time)
  }, [ data ])

  return (
    <div className="calendar__day compressed" >
      <div className="compressed__date">
        <h2>{date}</h2>
      </div>
      <div className="compressed__slots">
        {dataToRender.map((slot) => {
          return (
            <span className="compressed__slots--appointment" key={slot.time}>
              [ {slot.time}]  {slot.appointment?.fullAddress}
            </span>
          )
        })}
      </div>
    </div>
  );
}

function MonthCalendar({ monthData }: monthProps) {
  return (
    <div className="calendar__month">
      <div className="weekday_initials">
        {[ "S", "M", "T", "W", "T", "F", "S" ].map((initial, idx) => <span className="initial" key={initial + idx}>{initial}</span>)}
      </div>
      {monthData.length && monthData.map((week: CalendarWeekType, idx) => {
        return (
          <div key={idx + week[ idx ].date.toString()} className="calendar__week">
            {
              week.map((day: CalendarDayType) => (
                <React.Fragment key={day.date.toString()}>
                  {day && <CompressedDay {...day} />}
                </React.Fragment>
              ))
            }
          </div>

        )
      })}
    </div>
  );
}