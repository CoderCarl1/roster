import { createContext, useState, useContext } from 'react';
import { TAppointmentWithCustomerNameAndFullAddress } from '@types';

type AppointmentContextType = {
    appointmentsData: TAppointmentWithCustomerNameAndFullAddress[];
    setAppointmentsData: React.Dispatch<
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
    const [appointmentsData, setAppointmentsData] = useState<
        TAppointmentWithCustomerNameAndFullAddress[]
    >([]);
    const value = {
        appointmentsData,
        setAppointmentsData,
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
