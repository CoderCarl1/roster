import {
    TAddressWithCustomerNameAndFullAddress,
    TAppointmentWithCustomerName,
    TAppointmentWithCustomerNameAndFullAddress,
    TCustomer,
} from '@types';
import { isAddress, isCustomer } from '@functions';

// export function getAppointmentsFromCustomerArray(customersArray: TCustomer[] = []) {
//   console.log(" getAppointmentsFromCustomerArray START")

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
//   console.log(" getAppointmentsFromCustomerArray END \n number of appointments ", appointments.length);

//   return appointments;

// }

export function addFullAddressToAppointment(
    appointmentObj: TAppointmentWithCustomerName
): TAppointmentWithCustomerNameAndFullAddress {
    if ('address' in appointmentObj) {
        const { address } = appointmentObj;
        if (address) {
            const addressLine2 = address.line2 ? ` ${address.line2}` : '';
            return {
                ...appointmentObj,
                fullAddress: `${address.number} ${address.line1}${addressLine2}, ${address.suburb}`,
            };
        }
    }

    return {
        ...appointmentObj,
        fullAddress: null,
    };
}


export function isAppointment(value: TAppointmentWithCustomerNameAndFullAddress | TAddressWithCustomerNameAndFullAddress |  TCustomer): value is TAppointmentWithCustomerNameAndFullAddress {
    value = value as TAppointmentWithCustomerNameAndFullAddress

    return Boolean(
        value?.id &&
        value?.recurring &&
        (value?.frequency === null || value.frequency) &&
        value?.customerId &&
        value?.addressId &&
        value?.start &&
        value?.end &&
        value?.completed &&
        (value?.completedAt === null || value.completedAt) &&
        value?.createdAt &&
        (value?.updatedAt === null || value.updatedAt) &&
        value?.address && isAddress(value.address) &&
        value?.customer && isCustomer(value.customer)
    );
}