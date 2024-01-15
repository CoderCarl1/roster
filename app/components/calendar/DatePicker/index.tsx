import { useEffect, useState } from "react";
import { CalendarProvider, useCalendar } from "../calendar.hooks";
import DateInputs from "./DateInputs";
import DayView from "./View.Day";
import WeekView from "./View.Week";
import MonthView from "./View.Month";
import CalendarControls from "./Calendar.Controls";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { ErrorCard } from "~/components";

export type viewType = "day" | "week" | "month";

type DatePickerProps = {
  cb?: (date: Date) => unknown;
  dateToSet?: Date;
} &  React.HTMLProps<HTMLDivElement>;


export default function Main(props: DatePickerProps){
  return (
    <CalendarProvider>
        <DatePicker {...props} />
    </CalendarProvider>
  )
}


function DatePicker({ cb, dateToSet, ...props }: DatePickerProps) {
  const { setCalendarDate, currentCalendarDate } = useCalendar();
  const [ currentCalendarViewType, setCurrentCalendarViewType ] = useState("day");
  
  useEffect(() => {
    if (dateToSet) {
      setCalendarDate(dateToSet);
    }
  }, [])

  useEffect(() => {
    if (cb){
      cb(currentCalendarDate);
    }
  }, [currentCalendarDate])



  function handleCalendarViewChange(viewType: viewType) {
    if (!viewType || ![ "day", "week", "month" ].includes(viewType)) return;
    setCurrentCalendarViewType(viewType)
  }

  return (
      <DateInputs {...props}>
        {/* Children shown depending on toggle inside of DateInputs */}
        <CalendarControls currentCalendarViewType={currentCalendarViewType} handleCalendarViewChange={handleCalendarViewChange} />
        {currentCalendarViewType === 'day' && <DayView />}
        {currentCalendarViewType === 'week' && <WeekView />}
        {currentCalendarViewType === 'month' && <MonthView />}
      </DateInputs>
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
    errorHeading = 'DatePicker Error';
    errorMessage = error.message;
  } else {
    errorHeading = 'Unknown Error - DatePicker';
    errorMessage = 'An unknown error occurred.';
  }


  return <ErrorCard errorHeading={errorHeading} errorMessage={errorMessage} errorStack={errorStack} />
}