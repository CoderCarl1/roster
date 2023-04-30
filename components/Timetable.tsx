import { useEffect, useMemo, useState } from "react";
import type { Tperson, Tappointment } from "@/types";
import AppointmentRow from "./AppointmentRow";

const useTimeUtils = () => {
  const [appointments, setAppointments] = useState<Tappointment[]>([]);

  useEffect(() => {
    async function fetchAppointments() {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      setAppointments(data);
    }
    fetchAppointments();
  }, []);

  const getAppointmentAtTime = (date: Date, time: string): Tappointment | undefined => {
    const timeDate = new Date(date);
    const [hour, minute] = time.split(":").map(Number);
    timeDate.setHours(hour, minute, 0, 0);
    const appointmentsAtTime = appointments.filter(appointment => {
      const start = new Date(appointment.startTime);
      const end = new Date(appointment.endTime);
      return timeDate >= start && timeDate < end;
    });
    return appointmentsAtTime.length > 0 ? appointmentsAtTime[0] : undefined;
  };
  
  return {getAppointmentAtTime};
}

type Props = {
  customers: Tperson[];
  date: Date;
};

const Timetable: React.FC<Props> = ({ customers, date }) => {
  const {getAppointmentAtTime} = useTimeUtils();

  const times = useMemo(() => {
    const timesArr = [];
    for (let i = 6; i < 18; i++) {
      timesArr.push(`${i}:00`);
      timesArr.push(`${i}:15`);
      timesArr.push(`${i}:30`);
      timesArr.push(`${i}:45`);
    }
    timesArr.push("18:00");
    return timesArr;
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>Appointment</th>
        </tr>
      </thead>
      <tbody>
      {times.map((time) => {
          const appointment = getAppointmentAtTime(date, time);
          const customer = appointment ? customers.find((c) => c.id === appointment.customerId) : undefined;
          return (
            <AppointmentRow
            key={time}
            time={time}
            appointment={appointment}
            customer={customer}
          />
          );
        })}
      </tbody>
    </table>
  );
};

export default Timetable;