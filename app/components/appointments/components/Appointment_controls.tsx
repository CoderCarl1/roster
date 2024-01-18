import DatePicker from '~/components/calendar/DatePicker';
import AppointmentSearchBar from './Appointment_SearchBar';
import { useAppointments } from '..';
import { useEffect } from 'react';

export default function Appointment_Controls(){
  const {timeSlotsForToday, setAppointmentProviderDate} = useAppointments();

  useEffect(() => {
    console.log("timeSlotsForToday", timeSlotsForToday)
  }, [timeSlotsForToday])
  return (
    <div>
      <h2>appointment controls</h2>
      
      <AppointmentSearchBar />
      <DatePicker cb={setAppointmentProviderDate}/>
    </div>
  )
}