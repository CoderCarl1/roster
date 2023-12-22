import {
    TAddressWithCustomerNameAndFullAddress,
    TAppointmentWithCustomerNameAndFullAddress,
    TCustomer,
} from '@types';
import { isAddress, isAppointment, isCustomer } from '@functions';

export function addFullName(
    obj: TCustomer | TAddressWithCustomerNameAndFullAddress | TAppointmentWithCustomerNameAndFullAddress
) {
    if (isCustomer(obj)) {
        return {
            ...obj,
            fullName: `${obj.firstName} ${obj.lastName}`.trim(),
        } as TCustomer;
    }

    if (isAddress(obj)) {
        const {customer} = obj;
        if (customer && isCustomer(customer)) {
          return {
            ...obj,
            fullName: `${customer.firstName} ${customer.lastName}`.trim(),
          } as TAddressWithCustomerNameAndFullAddress;
        }
      }

      if (isAppointment(obj)) {
        const {customer} = obj;
        if (customer && isCustomer(customer)) {
          return {
            ...obj,
            fullName: `${customer.firstName} ${customer.lastName}`.trim(),
          } as TAppointmentWithCustomerNameAndFullAddress;
        }
      }

    return obj && typeof obj === 'object'
    ? { ...(obj as Record<string, unknown>), fullName: null }
    : null;
}




