import { TAppointment } from "@types";
import { useCalendar } from ".";
import { useAppointments } from "../appointments";
import { useEffect, useMemo, useState } from "react";
import { useCalendarContext } from "~/contexts";
import { CalendarAppointment, CalendarDayType, CalendarMonthType, CalendarType, CalendarWeekType } from "./useCalendar";
// import Table, { Caption, TH } from "../table/table";
import { Button, LoadingComponent } from '@components';
import { dates } from "~/functions";
import React from "react";

type mainProps = {
  type: 'day' | 'week' | 'month';
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;


export default function Main({ type = 'day', ...props }: mainProps) {
  const [ calendarData, setCalendarData ] = useState<CalendarType | null>(null);

  const { getAppointmentsForDay, getAppointmentsForWeek, getAppointmentsForMonth, appointmentsData } = useAppointments();
  const { getDay, getWeek, getMonth } = useCalendar();
  const { currentDate, setDate, nextDay, nextWeek, nextMonth, prevDay, prevWeek, prevMonth } = useCalendarContext();

  useEffect(() => {
    let appointments;
    console.log("currentDate.date", currentDate.date)
    console.log("type", type)
    const setData = {
      day: () => {
        appointments = getAppointmentsForDay(currentDate.date);
        if (appointments.length) {
          const dayCalendarData = getDay(currentDate.date, appointments);
          setCalendarData(dayCalendarData);
        }
      },
      week: () => {
        const sunday = dates.startOfWeek(currentDate.date);
        setDate(sunday);
        appointments = getAppointmentsForWeek(sunday);
        if (appointments.length) {
          const weekCalendarData = getWeek(sunday, appointments);
          setCalendarData(weekCalendarData);
        }
      },
      month: () => {
        appointments = getAppointmentsForMonth(currentDate.date);
        if (appointments.length) {
          const monthCalendarData = getMonth(currentDate.date, appointments);
          setCalendarData(monthCalendarData);
        }
      }
    }
    setData[ type ]();

  }, [ type, currentDate.date, appointmentsData ])

  function handleNext() {
    switch (type.toLowerCase()) {
      case 'day':
        console.log("next day")
        nextDay();
        break;
      case 'week':
        console.log("next week")
        nextWeek()
        break;
      case 'month':
        console.log("next month")
        nextMonth();
        break;
      default:
        return null;
    }
  }

  function handlePrev() {
    switch (type.toLowerCase()) {
      case 'day':
        console.log("prev day")
        prevDay();
        break;
      case 'week':
        console.log("prev week")
        prevWeek()
        break;
      case 'month':
        console.log("prev month")
        prevMonth();
        break;
      default:
        return null;
    }
  }

  if (!calendarData) {
    return <LoadingComponent />
  }
  return (
    <section {...props}>
      <div><Button onClick={handlePrev}>prev</Button><Button onClick={handleNext}>next</Button></div>
      {(() => {
        switch (type.toLowerCase()) {
          case 'day':
            return <DayCalendar calendarData={calendarData as CalendarDayType} />;
          case 'week':
            return <WeekCalendar calendarData={calendarData as CalendarWeekType} />;
          case 'month':
            return <MonthCalendar calendarData={calendarData as CalendarMonthType} />;
          default:
            return <h1>Invalid calendar type - this should be impossibru</h1>;
        }
      })()}
    </section>
  )
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