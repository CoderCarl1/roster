import {
    TAddress,
    TAddressWithCustomerNameAndFullAddress,
    TAppointment,
    TAppointmentWithCustomerNameAndFullAddress,
    TCustomer,
} from '@types';

export function addFullName(
    obj: TCustomer | TAddress | TAppointment
):
    | TCustomer
    | TAddressWithCustomerNameAndFullAddress
    | TAppointmentWithCustomerNameAndFullAddress {
    if ('customer' in obj) {
        const customer = obj.customer;
        return {
            ...obj,
            fullName: `${customer?.firstName} ${customer?.lastName}`.trim(),
        };
    }

    if ('firstName' in obj && 'lastName' in obj) {
        return {
            ...obj,
            fullName: `${obj.firstName} ${obj.lastName}`.trim(),
        };
    }

    return { ...obj, fullName: null };
}
