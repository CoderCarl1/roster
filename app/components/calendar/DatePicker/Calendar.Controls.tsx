import { Button } from "~/components";
import { useCalendar } from "../calendar.hooks";
import {viewType} from '.';
import { Arrow } from "~/icons";

type calendarControlsProps = {
  currentCalendarViewType: string;
  handleCalendarViewChange: (viewType: viewType) => void;
}
export default function CalendarControls({ currentCalendarViewType, handleCalendarViewChange }: calendarControlsProps) {
  const { nextMonth, prevMonth, monthName } = useCalendar();

  return (
    <div className="calendar__controls">
      <span className="calendar__controls--monthName">{monthName}</span>
      {[ 'day', 'week', 'month' ].map(calendarType => {
        return (
          <Button
            key={"calendar__control" + calendarType}
            className={calendarType === currentCalendarViewType ? "current" : ""}
            onClick={() => handleCalendarViewChange(calendarType as viewType)}>
            {calendarType}
          </Button>
        )
      })
      }
      <div className="calendar__controls--nextPrev">
        <Button className="calendar__controls month__prev" onClick={prevMonth} ><Arrow className="left" /></Button>
        <Button className="calendar__controls month__next" onClick={nextMonth}><Arrow className="right" /></Button>
      </div>
    </div>
  )
}
