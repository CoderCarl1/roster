import { TAppointment } from "@types";
import { useCalendar } from ".";
import { useAppointments } from "../appointments";
import { useEffect, useMemo, useState } from "react";
import { useCalendarContext } from "~/contexts";
import { CalendarAppointment, CalendarDayType, CalendarMonthType, CalendarType, CalendarWeekType } from "./useCalendar";
import Table, { Caption, TH } from "../table/table";
import { LoadingComponent } from "..";
import { dates } from "~/functions";
import React from "react";

type calendarRanges = 'day' | 'week' | 'month';

type mainProps = {
  type: calendarRanges;
}


export default function Main({ type = 'day' }: mainProps) {
  const [ calendarData, setCalendarData ] = useState<CalendarType | null>(null);

  const { getAppointmentsForDay, getAppointmentsForWeek, getAppointmentsForMonth, appointmentsData } = useAppointments();
  const { getDay, getWeek, getMonth } = useCalendar();
  const { currentDate, setDate } = useCalendarContext();

  useEffect(() => {
    console.log("CALENDAR use effect running")

    let appointments;
    let calendarSlots;

    const setData = {
      day: () => {
        appointments = getAppointmentsForDay(currentDate.date);
        if (appointments.length) {
          calendarSlots = getDay(currentDate.date, appointments);
          setCalendarData(calendarSlots);
        }
      },
      week: () => {
        const sunday = dates.startOfWeek(currentDate.date);
        setDate(sunday);
        appointments = getAppointmentsForWeek(sunday);
        if (appointments.length) {
          calendarSlots = getWeek(sunday, appointments);
          setCalendarData(calendarSlots);
        }
      },
      month: () => {
        appointments = getAppointmentsForMonth(currentDate.date);
        if (appointments.length) {
          calendarSlots = getMonth(currentDate.date, appointments);
          setCalendarData(calendarSlots);
        }
      }
    }

    setData[ type ]();

  }, [ type, appointmentsData ])


  if (!calendarData) {
    <LoadingComponent />
  }
  if (type.toLowerCase() === 'day' && calendarData) {
    return <DayCalendar calendarData={calendarData as CalendarDayType} />
  }
  if (type.toLowerCase() === 'week' && calendarData) {
    return <WeekCalendar calendarData={calendarData as CalendarWeekType} />
  }
  if (type.toLowerCase() === 'month' && calendarData) {
    return <MonthCalendar calendarData={calendarData as CalendarMonthType} />
  }

  return <>
    <h1> no type of calendar - this should be impossibru </h1>
  </>

}

type dayProps = {
  calendarData: CalendarDayType;
}
type weekProps = {
  calendarData: CalendarWeekType
}
type monthProps = {
  calendarData: CalendarMonthType
}
function renderLongDay({ calendarData }: dayProps) {
  // console.log("renderDay", {calendarData})
  const { data, dayName } = calendarData;
  return (
    <div>
      <h3>{dayName && dayName}</h3>

      {data.length && data.map((slot, idx) => (
        <div key={idx + slot.time}>
          Time: {slot.time}, Appointment ID: {slot.appointment?.id}
        </div>
      ))}
    </div>

  );
}


function DayCalendar({ calendarData }: dayProps) {
  return (
    <>
      {calendarData && renderLongDay({ calendarData })}
    </>
  )
}

function renderCompressedDay({ date, data }: CalendarDayType) {
  const dataToRender = useMemo(() => {
    return data.filter(slot => (slot.appointment !== null || slot.appointment !== undefined) && slot.appointment?.start === slot.time)
  }, [data])

  return (
    <div className="day compressed" style={{ "display": "flex", "flexDirection": "column" }}>
      <span>{date}</span>
      {dataToRender.map((slot) => {
        return (
          <div key={slot.time}>
            [ {slot.time}]  {slot.appointment?.fullAddress}
          </div>
        )
        })}
    </div>
  );
}

function WeekCalendar({ calendarData }: weekProps) {
  console.log("WeekCalendar", calendarData)

  return (
    <div style={{ display: 'flex' }}>
      {calendarData.map((day: CalendarDayType) => (
        <React.Fragment key={day.date.toString()}>
          {day && renderCompressedDay(day)}
        </React.Fragment>
      ))}
    </div>
  );
}

function MonthCalendar({ calendarData }: monthProps) {
  console.log("MonthCalendar", calendarData)

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {calendarData.length && calendarData.map((week: CalendarWeekType) => (
        <WeekCalendar key={week[ 0 ].date.toString()} calendarData={week} />
      ))}
    </div>
  );
}