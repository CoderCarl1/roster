import { Button } from "~/components";
import { useCalendar } from "../calendar.hooks";
import { viewType } from '.';
import { Arrow } from "~/icons";

type calendarControlsProps = {
  currentCalendarViewType: string;
  handleCalendarViewChange: (viewType: viewType) => void;
}
export default function CalendarControls({ currentCalendarViewType, handleCalendarViewChange }: calendarControlsProps) {
  const { nextMonth, prevMonth, monthName } = useCalendar();

  return (
    <div className="calendar__controls">
      <div className="calendar__controls--row">
        <Button className="calendar__control calendar__control--month-change" onClick={prevMonth} ><Arrow className="left" /></Button>
        <span className="calendar__control--month-name">{monthName}</span>
        <Button className="calendar__control calendar__control--month-change" onClick={nextMonth}><Arrow className="right" /></Button>
      </div>
      <div className="calendar__controls--row">
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
      </div>
    </div>
  )
}
