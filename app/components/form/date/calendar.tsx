import {
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import React, { useEffect, useRef, useState } from "react"
import { monthNames, shortMonthNames } from "~/functions/helpers/dates";
import { dates } from "@functions";
import { Button } from "@components";
import { isNumber } from "~/functions/helpers/typechecks";

type dateParts = {
  currentDate: Date;
  monthName: string;
  daysInMonth: number;

}
function useCalendar() {
  const today = new Date();
  const [ currentDateParts, setCurrentDateParts ] = useState<dateParts>({
    currentDate: today,
    monthName: monthNames[ today.getMonth() ],
    daysInMonth: dates.getDaysInMonth(today.getFullYear(), today.getMonth())
  });

  const timeOutRef = useRef<NodeJS.Timeout[]>([]);
  const calendarRef = useRef<HTMLDivElement>(null);

  function recordTimeout(timeOut: NodeJS.Timeout) {
    timeOutRef.current = [ ...timeOutRef.current, timeOut ];
  }

  useEffect(() => {
    return () => {
      timeOutRef.current.forEach((timeout) => {
        if (timeout) {
          clearTimeout(timeout);
        }
      });
    };
  }, []);

  useEffect(() => {
      const elementsArray = [...calendarRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>];
        
        if (elementsArray.length) {
          elementsArray[0].focus();
        }

  }, [calendarRef.current] )

  function setCalendarDate(date: Date) {
    if (calendarRef.current) {
      calendarRef.current.classList.toggle('fadeout');
      
      const RefTimeout = setTimeout(() => {
        
        date = dates.parseDate(date);

        setCurrentDateParts({
          currentDate: date,
          monthName: monthNames[ date.getMonth() ],
          daysInMonth: dates.getDaysInMonth(date.getFullYear(), date.getMonth())
        });


      }, 250)
      
      recordTimeout(RefTimeout);
    }
  }

  function setCalendarMonth(monthNumber: number) {
    const date = new Date(currentDateParts.currentDate.getFullYear(), monthNumber, currentDateParts.currentDate.getDay());
    setCalendarDate(date);
  }

  return {
    calendarDate: currentDateParts.currentDate,
    calendarRef,
    currentMonthName: currentDateParts.monthName,
    daysInMonth: currentDateParts.daysInMonth,
    setCalendarMonth,
    setCalendarDate,
    recordTimeout,
  }
}

type calendarDisplayTypes = 'day' | 'week' | 'month';

type CalendarProps = {
  calendarType: calendarDisplayTypes;
  date?: Date;
  cb: () => unknown;
  className: string;
}

export default function Calendar({ calendarType = 'day', date, cb, className = '', ...props }: CalendarProps) {
  const { setCalendarDate } = useCalendar();


  
  useEffect(() => {
    if (!date) return;
    setCalendarDate(date);
  }, [ date ])

  const calendarComponents = {
    day: <DayView />,
    week: <WeekView />,
    month: <MonthView />,
  };


  return (
    <>
      {calendarComponents[ calendarType ]}
    </>
  );
}

type DayProps = {
  className?: string;
}
function DayView({ className = '', ...props }: DayProps) {

  return (
    <>
      day
    </>
  )
}

type WeekProps = {
  className?: string;
}
function WeekView({ className = '', ...props }: WeekProps) {
  return (
    <table role="region" aria-labelledby="calendar_caption" tabIndex={0} {...props} >
      <caption className="visually-hidden" id="calendar_caption">weeks</caption>
      <tbody>

      </tbody>
    </table>
  )
}

type MonthProps = {
  className?: string;
}
function MonthView({ className = '', ...props }: MonthProps) {
  const { currentMonthName, calendarRef, setCalendarMonth } = useCalendar();

  return (
    <div 
      ref={calendarRef}
      className={"calendar__view" + className ? ` ${className}` : ''}
      data-calendartype="month"
      role="region"
      aria-labelledby="calendar_caption"
      tabIndex={0} {...props}
    >
      <p className="visually-hidden" id="calendar_caption">Months</p>
      {monthNames.map((month, idx) => {
        if (month === currentMonthName) {
          return (
            <Button
              key={'month-grid' + idx}
              className="month current"
              onClick={() => setCalendarMonth(idx)}
              aria-label={month}
            >
              {shortMonthNames[ idx ]}
            </Button>
          );
        }
        return (
          <Button
            key={'month-grid' + idx}
            className="month"
            onClick={() => setCalendarMonth(idx)}
          >
            {shortMonthNames[ idx ]}
          </Button>
        );
      })}
    </div>
  )
}


export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}