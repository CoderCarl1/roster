import { AppointmentProvider } from '../appointment.hooks';
import DayView from './calendar.day';
import MonthView from './calendar.month';
import WeekView from './calendar.week';
import ListView from './list';

const AppointmentCalendar = {
    day: DayView,
    week: WeekView,
    month: MonthView,
    list: ListView,
};
export type AppointmentViewTypes = 'list' | 'day' | 'week' | 'month';

type AppointmentViewProps = {
    displayType: AppointmentViewTypes;
} & React.HTMLProps<HTMLDivElement>;

export default function AppointmentView({
    displayType = 'day',
    ...props
}: AppointmentViewProps) {
    const ViewComponent = AppointmentCalendar[displayType];

    return (
            <ViewComponent {...props} />
    );
}
