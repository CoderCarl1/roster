import { isAddress, isCustomer } from '@functions';
import {
    TAddressWithCustomerNameAndFullAddress,
    TAppointmentWithCustomerName,
    TAppointmentWithCustomerNameAndFullAddress,
    TCustomer,
} from '@types';

// export function getAppointmentsFromCustomerArray(customersArray: TCustomer[] = []) {

//   const appointments = customersArray.reduce((appointmentsArr, customer) => {
//     if (customer.appointments && customer.appointments.length) {
//       const customerWithFullName = addFullName(customer).fullName;

//       const updatedAppointments = customer.appointments.map((appointment) => {
//         const addressForAppointment = customer.addresses?.find(
//           (address) => address.id === appointment.addressId
//         );

//         if (addressForAppointment) {
//           const AddressWithFullAddress = addFullAddress(addressForAppointment).fullAddress;

//           return {
//             fullName: customerWithFullName,
//             fullAddress: AddressWithFullAddress,
//             ...appointment,
//           }
//         } else {
//           throw new Error(`appointment ${appointment.id} is not associated with an address`)
//         }
//       })
//       appointmentsArr.push(...updatedAppointments);
//     }
//     return appointmentsArr;
//   }, [] as TAppointmentWithCustomerNameAndFullAddress[]);

//   return appointments;

// }
