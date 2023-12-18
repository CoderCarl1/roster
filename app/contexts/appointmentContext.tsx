import { createContext, useState, useContext } from 'react';
import { TAppointmentWithCustomerNameAndFullAddress } from '@types';

type AppointmentContextType = {
    appointments: TAppointmentWithCustomerNameAndFullAddress[];
    setAppointments: React.Dispatch<
        React.SetStateAction<TAppointmentWithCustomerNameAndFullAddress[]>
    >;
    currentAppointment: TAppointmentWithCustomerNameAndFullAddress | null;
    setCurrentAppointment: React.Dispatch<
        React.SetStateAction<TAppointmentWithCustomerNameAndFullAddress | null>
    >;
};

const AppointmentContext = createContext<AppointmentContextType | null>(null);

export function AppointmentProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [currentAppointment, setCurrentAppointment] =
        useState<null | TAppointmentWithCustomerNameAndFullAddress>(null);
    const [appointments, setAppointments] = useState<
        TAppointmentWithCustomerNameAndFullAddress[]
    >([]);
    const value = {
        appointments,
        setAppointments,
        currentAppointment,
        setCurrentAppointment,
    };
    return (
        <AppointmentContext.Provider value={value}>
            {children}
        </AppointmentContext.Provider>
    );
}

export function useAppointmentContext() {
    const context = useContext(AppointmentContext);

    if (!context) {
        throw new Error(
            'useAppointmentContext must be used within a AppointmentsProvider'
        );
    }
    return context;
}
