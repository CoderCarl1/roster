import { useEffect, useState } from 'react';
import { TCustomer, TAppointmentWithCustomerName } from '@types';
import { useCustomers } from '~/components';

function useAppointments(appointmentArray?: TAppointmentWithCustomerName[]) {
    const [currentAppointment, setCurrentAppointment] =
        useState<null | TAppointmentWithCustomerName>(null);
    const [appointmentData, setAppointmentData] = useState<
        TAppointmentWithCustomerName[]
    >(() => {
        if (!appointmentArray) return [];
        return appointmentArray;
    });

    useEffect(() => {
        if (appointmentArray) {
            setAppointmentData(appointmentArray);
        }
    }, []);

    function setAppointment(appointmentId?: string) {
        let data = null;
        if (appointmentId && appointmentArray) {
            data =
                appointmentData.find(
                    (appointment) => appointment.id === appointmentId
                ) ?? null;
        }
        setCurrentAppointment(data);
    }

    return {
        setAppointment,
        currentAppointment,
        getAppointmentsFromCustomerArray,
    };
}

function getAppointmentsFromCustomerArray(customers: TCustomer[] = []) {
    const { extractFullName } = useCustomers();

    return customers.reduce((appointmentsArr, customer) => {
        if (customer.appointments && customer.appointments.length) {
            appointmentsArr.push(
                ...customer.appointments.map((appointment) => {
                    const address = customer.addresses?.find(
                        (address) => address.id === appointment.addressId
                    );

                    const appointmentAddressData = Object.assign(
                        {},
                        { fullAddress: address ? address : '' }
                    );

                    return {
                        ...appointmentAddressData,
                        fullName: extractFullName(customer),
                        ...appointment,
                    };
                })
            );
        }
        return appointmentsArr;
    }, [] as TAppointmentWithCustomerName[]);
}

useAppointments.getAppointmentsFromCustomerArray =
    getAppointmentsFromCustomerArray;

export { useAppointments as default, getAppointmentsFromCustomerArray };
