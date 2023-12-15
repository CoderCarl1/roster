
import { TAppointmentWithCustomerNameAndAddress, TCustomer } from "@types";
import { addFullName, addFullAddress } from "@functions";

export function getAppointmentsFromCustomerArray(customersArray: TCustomer[] = []) {
  console.log(" getAppointmentsFromCustomerArray START")

  const appointments = customersArray.reduce((appointmentsArr, customer) => {
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
  }, [] as TAppointmentWithCustomerNameAndAddress[]);
  console.log(" getAppointmentsFromCustomerArray END \n number of appointments ", appointments.length );
  return appointments;

}


