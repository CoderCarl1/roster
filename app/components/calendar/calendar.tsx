import { TAppointment } from "@types";
import { useCalendar } from ".";
import { useAppointments } from "../appointments";
import { useEffect, useState } from "react";
import { useCalendarContext } from "~/contexts";
import { CalendarAppointment, CalendarDayType, CalendarMonthType, CalendarType, CalendarWeekType } from "./useCalendar";
import Table, { Caption, TH } from "../table/table";
import { LoadingComponent } from "..";
import { startOfWeek } from "~/functions";

type calendarRanges = 'day' | 'week' |'month';

type mainProps = {
  type: calendarRanges;
}


export default function Main({type = 'day'}: mainProps){
  const [calendarData, setCalendarData] = useState<CalendarType | null>(null);

  const {getAppointmentsForDay, getAppointmentsForWeek, getAppointmentsForMonth, appointmentsData} = useAppointments();
  const {getDay, getWeek, getMonth} = useCalendar();
  const { currentDate, setDate } = useCalendarContext();


  useEffect(() => {
    console.log("CALENDAR use effect running")

    let appointments;
    let calendarSlots;

    const setData = {
      day: () => {
        appointments = getAppointmentsForDay(currentDate.date);
        if (appointments.length){
          calendarSlots = getDay(currentDate.date, appointments);
          setCalendarData(calendarSlots);
        }
      },
      week: () => {
        const sunday = startOfWeek(currentDate.date);
        setDate(sunday);
        appointments = getAppointmentsForWeek(sunday);
        if (appointments.length){
          calendarSlots = getWeek(sunday, appointments);
          setCalendarData(calendarSlots);
        }
      },
      month: () => {
        appointments = getAppointmentsForMonth(currentDate.date);
        if (appointments.length){
          calendarSlots = getMonth(currentDate.date, appointments);
          setCalendarData(calendarSlots);
        }
      }
    }
   
    setData[type]();

  }, [type, appointmentsData])  


  if (!calendarData) {
    <LoadingComponent />
  }
  if (type.toLowerCase() === 'day' && calendarData) {
    return <DayCalendar calendarData={calendarData as CalendarDayType}/>
  }
  if (type.toLowerCase() === 'week' && calendarData) {
    return <WeekCalendar calendarData={calendarData as CalendarWeekType}/>
  }
  if (type.toLowerCase() === 'month' && calendarData) {
    return <MonthCalendar calendarData={calendarData as CalendarMonthType}/>
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
function renderDay({ calendarData }: dayProps) {
  // console.log("renderDay", {calendarData})
  const {getDayName} = useCalendar();
  const {data, date} = calendarData;
  return (
    <div>
      <h3>{date && getDayName(date)}</h3>

      {data.length && data.map((slot, idx) => (
        <div key={idx + slot.time}>
          Time: {slot.time}, Appointment ID: {slot.appointment?.id}
        </div>
      ))}
    </div>

  );
}


function DayCalendar({calendarData}: dayProps ){
  // console.log("DayCalendar")
  return (
    <>
      {calendarData && renderDay({calendarData})}
    </>
  )
}

function WeekCalendar({ calendarData }: weekProps) {
  console.log("WeekCalendar", calendarData)

  return (
    <div style={{ display: 'flex' }}>
      {calendarData.map((day: CalendarDayType) => (
        <DayCalendar key={day.date.toString()} calendarData={day} />
      ))}
    </div>
  );
}

function MonthCalendar({ calendarData }: monthProps) {
  console.log("MonthCalendar", calendarData)

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {calendarData.map((week: CalendarWeekType) => (
        <WeekCalendar key={week[0].date.toString()} calendarData={week} />
      ))}
    </div>
  );
}