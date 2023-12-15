import { TAppointmentWithCustomerName } from '@types';
import { useCustomers } from '@components';
import { useAppointmentContext } from '@contexts';
import { addFullAddress, addFullName } from '@functions';

function useAppointments() {
    const { appointments, setAppointments, currentAppointment, setCurrentAppointment } = useAppointmentContext();

    function setAppointment(appointmentId?: string) {
        let data = null;
        if (appointmentId && appointments) {
            data = appointments.find(
                (appointment) => appointment.id === appointmentId
            ) ?? null;
        }
        setCurrentAppointment(data);
    }

    function getAppointmentsFromCustomerContext() {
        const { customers } = useCustomers();
        const {setAppointments} = useAppointmentContext();

        const appointments = customers.reduce((appointmentsArr: TAppointmentWithCustomerName[], customer) => {
            if (customer.appointments && customer.appointments.length) {

                const customerWithFullName = addFullName(customer).fullName;
                const updatedAppointments = customer.appointments.map((appointment) => {
                    const addressForAppointment = customer.addresses?.find(
                      (address) => address.id === appointment.addressId
                    );
            
                    if (addressForAppointment) {
                      const AddressWithFullAddress = addFullAddress(addressForAppointment).fullAddress;
                      
                      return {
                        fullName: customerWithFullName,
                        fullAddress: AddressWithFullAddress,
                        ...appointment,
                      }
                    } else {
                      throw new Error(`appointment ${appointment.id} is not associated with an address`)
                    }
                  })
                  appointmentsArr.push(...updatedAppointments);
            }
            return appointmentsArr;
        }, [] as TAppointmentWithCustomerName[]);

        setAppointments(appointments);

        return appointments;
    }

    return {
        appointments, 
        setAppointments,
        currentAppointment,
        setAppointment,
        getAppointmentsFromCustomerContext,
    };
}


export { useAppointments as default };
