import { addFullName } from '@functions';
import {
    TCustomer,
    TAddressWithCustomerNameAndFullAddress,
    TAddress,
} from '@types';

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

export function addFullAddress(addressObj: TAddress) {
    const addressLine2 = addressObj.line2 ? ` ${addressObj.line2}` : '';
    return {
        ...addressObj,
        fullAddress: `${addressObj.number} ${addressObj.line1}${addressLine2}, ${addressObj.suburb}`,
    };
}
