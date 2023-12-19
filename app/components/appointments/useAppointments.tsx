import { useAppointmentContext } from '@contexts';
import { startOfWeek } from '@functions';

function useAppointments() {
    const {
        appointmentsData,
        setAppointmentsData,
        currentAppointment,
        setCurrentAppointment,
    } = useAppointmentContext();

    function setAppointment(appointmentId?: string) {
        let data = null;
        if (appointmentId && appointmentsData) {
            data =
                appointmentsData.find(
                    (appointment) => appointment.id === appointmentId
                ) ?? null;
        }
        setCurrentAppointment(data);
    }

    function getAppointmentsForDay(selectedDate: Date) {
        const appointmentData = appointmentsData.filter((appointment) => {
            const appointmentDate = new Date(appointment.start);

            return (
                appointmentDate.getDate() === selectedDate.getDate() &&
                appointmentDate.getMonth() === selectedDate.getMonth() &&
                appointmentDate.getFullYear() === selectedDate.getFullYear()
            );
        });
        console.log("getAppointmentsForDay appointmentData for day", appointmentData)
        return appointmentData

    }

    function getAppointmentsForWeek(selectedStartDate: Date) {
        if (!appointmentsData) return [];

        const sunday = startOfWeek(selectedStartDate)
        const selectedEndDate = new Date(sunday);
        selectedEndDate.setDate(sunday.getDate() + 6);

        const appointmentData = appointmentsData.filter((appointment) => {
            const appointmentDate = new Date(appointment.start);
            return (
                appointmentDate >= selectedStartDate &&
                appointmentDate <= selectedEndDate
            );
        });
       
        return appointmentData;
    }

    function getAppointmentsForMonth(dateWithinMonth: Date) {
        if (!appointmentsData) return [];
        
        const startDate = new Date(dateWithinMonth);
        const month = startDate.getMonth();
        const year = startDate.getFullYear();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const appointmentData =  appointmentsData.filter((appointment) => {
            const appointmentDate = new Date(appointment.start);

            return appointmentDate >= firstDay && appointmentDate <= lastDay;
        });

        console.log("getAppointmentsForMonth appointmentData for month", appointmentData)
        return appointmentData;
    }

    return {
        appointmentsData,
        setAppointmentsData,
        currentAppointment,
        setAppointment,
        getAppointmentsForDay,
        getAppointmentsForWeek,
        getAppointmentsForMonth,
    };
}

export { useAppointments as default };
