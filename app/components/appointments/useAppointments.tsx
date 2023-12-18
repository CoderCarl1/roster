import { useAppointmentContext } from '@contexts';

function useAppointments() {
    const {
        appointments,
        setAppointments,
        currentAppointment,
        setCurrentAppointment,
    } = useAppointmentContext();

    function setAppointment(appointmentId?: string) {
        let data = null;
        if (appointmentId && appointments) {
            data =
                appointments.find(
                    (appointment) => appointment.id === appointmentId
                ) ?? null;
        }
        setCurrentAppointment(data);
    }

    function getAppointmentsForDay(selectedDate: Date) {
        return appointments.filter((appointment) => {
            const appointmentDate = new Date(appointment.start);

            return (
                appointmentDate.getDate() === selectedDate.getDate() &&
                appointmentDate.getMonth() === selectedDate.getMonth() &&
                appointmentDate.getFullYear() === selectedDate.getFullYear()
            );
        });
    }

    function getAppointmentsForWeek(selectedStartDate: Date) {
        const selectedEndDate = new Date(selectedStartDate);
        selectedEndDate.setDate(selectedStartDate.getDate() + 6);

        return appointments.filter((appointment) => {
            const appointmentDate = new Date(appointment.start);

            return (
                appointmentDate >= selectedStartDate &&
                appointmentDate <= selectedEndDate
            );
        });
    }

    function getAppointmentsForMonth(dateWithinMonth: Date) {
        const startDate = new Date(dateWithinMonth);
        const month = startDate.getMonth();
        const year = startDate.getFullYear();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        return appointments.filter((appointment) => {
            const appointmentDate = new Date(appointment.start);

            return appointmentDate >= firstDay && appointmentDate <= lastDay;
        });
    }

    return {
        appointments,
        setAppointments,
        currentAppointment,
        setAppointment,
        getAppointmentsForDay,
        getAppointmentsForWeek,
        getAppointmentsForMonth,
    };
}

export { useAppointments as default };
