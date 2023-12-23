import { useAppointmentContext } from '@contexts';
import { dates, log } from '@functions';

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
        if (!appointmentsData.length) return [];
        const day = new Date(selectedDate);
        const appointmentData = appointmentsData.filter((appointment) => {
            const appointmentDate = new Date(appointment.start);

            return (
                appointmentDate.getDate() === day.getDate() &&
                appointmentDate.getMonth() === day.getMonth() &&
                appointmentDate.getFullYear() === day.getFullYear()
            );
        });
        return appointmentData
    }

    function getAppointmentsForWeek(selectedStartDate: Date) {
        if (!appointmentsData.length) return [];

        const startOfWeek = new Date(selectedStartDate)
        const selectedEndDate = new Date(startOfWeek);
        selectedEndDate.setDate(startOfWeek.getDate() + 6);

        const appointmentData = appointmentsData.filter((appointment) => {
            const appointmentDate = new Date(appointment.start);
            return (
                appointmentDate >= startOfWeek &&
                appointmentDate <= selectedEndDate
            );
        });
        return appointmentData;
    }

    function getAppointmentsForMonth(dateWithinMonth: Date) {
        if (!appointmentsData.length) return [];

        const startDate = new Date(dateWithinMonth);

        // Check if the start date is not a Sunday, and adjust it to the nearest Sunday
        if (startDate.getDay() !== 0) {
            const nearestSunday = dates.startOfWeek(startDate).getTime();
            startDate.setTime(nearestSunday);
        }

        // Calculate the end date by getting the end of the week for the last day of the month
        const lastDay = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        const endDate = dates.endOfWeek(lastDay);

        const appointmentData = appointmentsData.filter((appointment) => {
            const appointmentDate = new Date(appointment.start);

            return appointmentDate >= startDate && appointmentDate <= endDate;
        });
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
