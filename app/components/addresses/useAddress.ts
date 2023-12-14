import { useState } from 'react';
import { TCustomer, TAddressWithCustomerNameAndFullAddress } from '@types';
import { useCustomers } from '~/components';

function useAddresses(addressArray: TAddressWithCustomerNameAndFullAddress[]) {
    const [currentAddress, setCurrentAddress] =
        useState<null | TAddressWithCustomerNameAndFullAddress>(null);

    function setAddress(addressId?: string) {
        let data = null;
        if (addressId && addressArray) {
            data =
                addressArray.find((address) => address.id === addressId) ??
                null;
        }
        setCurrentAddress(data);
    }
    return { setAddress, currentAddress };
}

function getAddressesFromCustomerArray(customers: TCustomer[] = []) {
    const { extractFullName } = useCustomers();

    return customers.reduce((addressesArr, customer) => {
        if (customer.addresses && customer.addresses.length) {
            addressesArr.push(
                ...customer.addresses.map((address) => ({
                    fullAddress: `${address.number} ${address.line1} ${address.line2}, ${address.suburb}`,
                    fullName: extractFullName(customer),
                    ...address,
                }))
            );
        }
        return addressesArr;
    }, [] as TAddressWithCustomerNameAndFullAddress[]);
}

useAddresses.getAddressesFromCustomerArray = getAddressesFromCustomerArray;
export { useAddresses as default, getAddressesFromCustomerArray };
