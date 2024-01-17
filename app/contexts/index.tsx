import { AppointmentProvider } from '~/components/appointments/appointment.hooks';
import { AddressProvider, useAddressContext } from './addressContext';
// import {
    // AppointmentProvider,
    // useAppointmentContext,
// } from './appointmentContext';
// import { CalendarProvider, useCalendarContext } from './calendarContext';
import { CustomerProvider, useCustomerContext } from './customerContext';

export {
    AppointmentProvider,
    // useAppointmentContext,
    CustomerProvider,
    useCustomerContext,
    AddressProvider,
    useAddressContext,
    // useCalendarContext,
    // CalendarProvider,
};

type providerProps = {
    children?: React.ReactNode;
};

export default function Providers({ children }: providerProps) {
    return (
        <CustomerProvider>
            <AppointmentProvider>
                <AddressProvider>
                    {/* <CalendarProvider> */}
                    {children}
                    {/* </CalendarProvider> */}
                </AddressProvider>
            </AppointmentProvider>
        </CustomerProvider>
    );
}
