import {
    TCustomer,
    TAppointmentWithCustomerNameAndFullAddress,
    TAddressWithCustomerNameAndFullAddress,
} from '@types';
import { isAddress, isAppointment, isCustomer } from '@functions';

// export function getAddressesFromCustomerArray(customers: TCustomer[] = []) {
//   console.log(" getAddressesFromCustomerArray START")
//   const addresses = customers.reduce((addressesArr, customer) => {
//     if (customer.addresses && customer.addresses.length) {
//       const fullName = addFullName(customer);

//       addressesArr.push(
//         ...customer.addresses.map((address) => {
//           const addressData = addFullAddress(address);

//           return Object.assign(addressData, fullName)
//         })
//       );
//     }
//     return addressesArr;
//   }, [] as TAddressWithCustomerNameAndFullAddress[]);
//   console.log(" getAddressesFromCustomerArray END \n number of addresses ", addresses.length );

//   return addresses;
// }

export function addFullAddress(obj: TAppointmentWithCustomerNameAndFullAddress | TAddressWithCustomerNameAndFullAddress) {

    if (isAppointment(obj)){
        const { address } = obj;
        if (address && isAddress(address)) {
            const addressLine2 = address.line2 ? ` ${address.line2}` : '';
            return {
                ...obj,
                fullAddress: `${address.number} ${address.line1}${addressLine2}, ${address.suburb}`,
            };
        }
    }
    if (isAddress(obj)){
        const addressLine2 = obj.line2 ? ` ${obj.line2}` : '';
        return {
            ...obj,
            fullAddress: `${obj.number} ${obj.line1}${addressLine2}, ${obj.suburb}`,
        };
    }

    return obj && typeof obj === 'object'
    ? { ...(obj as Record<string, unknown>), fullAddress: null }
    : null;
}


