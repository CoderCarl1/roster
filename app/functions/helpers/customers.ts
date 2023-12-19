import {
    TAddress,
    TAddressWithCustomerName,
    TAddressWithCustomerNameAndFullAddress,
    TAddressWithFullAddress,
    TAppointment,
    TAppointmentWithCustomerName,
    TAppointmentWithCustomerNameAndFullAddress,
    TCustomer,
} from '@types';

export function addFullName(
    obj: TCustomer | TAddress | TAddressWithFullAddress | TAppointment
) {

    if ('customerId' in obj) {
        const { customer } = obj;
        return {
            ...obj,
            fullName: `${customer?.firstName} ${customer?.lastName}`.trim(),
        } as TAppointmentWithCustomerName | TAppointmentWithCustomerNameAndFullAddress |  TAddressWithCustomerName |TAddressWithCustomerNameAndFullAddress;
    }

    if ('firstName' in obj && 'lastName' in obj) {
        return {
            ...obj,
            fullName: `${obj.firstName} ${obj.lastName}`.trim(),
        } as TCustomer;
    }

    if (typeof obj === 'object' && obj !== null) {
        return { ...(obj as Record<string, unknown>), fullName: null };
    }

    return { fullName: null };
}
