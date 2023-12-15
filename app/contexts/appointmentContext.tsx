import { TAppointmentWithCustomerName } from "@types";
import { createContext, useState, useContext } from "react";

type AppointmentContextType = {
  appointments: TAppointmentWithCustomerName[];
  setAppointments: React.Dispatch<React.SetStateAction<TAppointmentWithCustomerName[]>>;
  currentAppointment: TAppointmentWithCustomerName | null;
  setCurrentAppointment: React.Dispatch<React.SetStateAction<TAppointmentWithCustomerName | null>>
}

const AppointmentContext = createContext<AppointmentContextType | null>(null);

export function AppointmentProvider({ children }: { children: React.ReactNode }) {
  const [ currentAppointment, setCurrentAppointment ] = useState<null | TAppointmentWithCustomerName>(null);
  const [ appointments, setAppointments ] = useState<TAppointmentWithCustomerName[]>([]);
  const value = { appointments, setAppointments, currentAppointment, setCurrentAppointment };
  return <AppointmentContext.Provider value={value}>
    {children}
  </ AppointmentContext.Provider>
}

export function useAppointmentContext() {
  const context = useContext(AppointmentContext);

  if (!context) {
    throw new Error('useAppointmentContext must be used within a AppointmentsProvider')
  }
  return context
}

