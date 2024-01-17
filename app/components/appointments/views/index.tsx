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
type AppointmentViewTypes = 'list' | 'day' | 'week' | 'month';

type AppointmentViewProps = {
    type: AppointmentViewTypes;
} & React.HTMLProps<HTMLDivElement>;

export default function AppointmentView({
    type = 'day',
    ...props
}: AppointmentViewProps) {
    const ViewComponent = AppointmentCalendar[type];

    return (
        <AppointmentProvider>
            <ViewComponent {...props} />
        </AppointmentProvider>
    );
}
