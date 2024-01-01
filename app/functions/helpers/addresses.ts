import {
    TAppointmentWithCustomerNameAndFullAddress,
    TAddressWithCustomerNameAndFullAddress,
} from '@types';
import { isAddress, isAppointment } from '~/functions';

export function addFullAddress(
    obj:
        | TAppointmentWithCustomerNameAndFullAddress
        | TAddressWithCustomerNameAndFullAddress
) {
    if (isAppointment(obj)) {
        const { address } = obj;
        if (address && isAddress(address)) {
            const addressLine2 = address.line2 ? ` ${address.line2}` : '';
            const updatedAppointment: TAppointmentWithCustomerNameAndFullAddress =
                {
                    ...obj,
                    fullAddress: `${address.number} ${address.line1}${addressLine2}, ${address.suburb}`,
                };
            return updatedAppointment;
        }
    }
    if (isAddress(obj)) {
        const addressLine2 = obj.line2 ? ` ${obj.line2}` : '';
        const updatedAddress: TAddressWithCustomerNameAndFullAddress = {
            ...obj,
            fullAddress: `${obj.number} ${obj.line1}${addressLine2}, ${obj.suburb}`,
        };
        return updatedAddress;
    }

    return obj;
}
