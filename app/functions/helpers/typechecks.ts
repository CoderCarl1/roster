import { log } from '@functions';
import {
    TAppointmentWithCustomerNameAndFullAddress,
    TAddressWithCustomerNameAndFullAddress,
    TCustomer,
} from '@types';

type ObjTypes =
    | TAppointmentWithCustomerNameAndFullAddress
    | TAddressWithCustomerNameAndFullAddress
    | TCustomer;

export function isAddress(
    value: ObjTypes
): value is TAddressWithCustomerNameAndFullAddress {
    value = value as TAddressWithCustomerNameAndFullAddress;
    if (!isObject(value) || 'addresses' in value || 'addressId' in value) {
        // log({ color: "cyan" }, "its definitely not an address so returning early", {
        //   data: {
        //     object: value,
        //     addresses: 'addresses' in value,
        //     addressId: 'addressId' in value
        //   }
        // })
        return false;
    }

    if (value?.appointments) {
        const isArray = Array.isArray(value.appointments);
        const appointmentsOnlyContainsAppointment =
            value.appointments.every(isAppointment);
        if (!isArray || !appointmentsOnlyContainsAppointment) {
            log({ color: 'blue' }, 'isAddress appointments is', {
                data: {
                    isArray,
                    appointmentsOnlyContainsAppointment,
                },
            });
            return false;
        }
    }

    return Boolean(
        exists('id', value) &&
            ((value?.number && exists('number', value)) ||
                isNull(
                    value?.number,
                    `number is not null, ${stringObject(value)}`
                )) &&
            exists('line1', value) &&
            ((value?.line2 && exists('line2', value)) ||
                isNull(
                    value?.line2,
                    `line2 is not null, ${stringObject(value)}`
                )) &&
            exists('suburb', value) &&
            exists('createdAt', value) &&
            ((value?.updatedAt && exists('updatedAt', value)) ||
                isNull(
                    value?.updatedAt,
                    `updatedAt is not null, ${stringObject(value)}`
                )) &&
            isBool(value?.archived, 'archived is not a bool') &&
            // customer
            ((value?.customerId && exists('customerId', value)) ||
                isNull(
                    value?.customerId,
                    `customerId is not null, ${stringObject(value)}`
                )) &&
            ('customer' in value ? isCustomer(value.customer!) : true)
    );
}

export function isAppointment(
    value: ObjTypes
): value is TAppointmentWithCustomerNameAndFullAddress {
    value = value as TAppointmentWithCustomerNameAndFullAddress;
    if (!isObject(value) || 'archived' in value || 'firstName' in value) {
        // log({ color: "cyan" }, "its definitely not an appointment so returning early", {
        //   data: {
        //     object: value,
        //     archived: 'archived' in value,
        //     firstName: 'firstName' in value
        //   }
        // })
        return false;
    }

    return Boolean(
        (exists('id', value) &&
            isBool(value?.recurring, `recurring is not a bool`) &&
            value?.frequency &&
            exists('frequency', value)) ||
            (isNull(value?.frequency, `frequency is not null`) &&
                exists('customerId', value) &&
                exists('addressId', value) &&
                exists('start', value) &&
                exists('end', value) &&
                isBool(value?.completed, `completed is not a bool`) &&
                ((value?.completedAt && exists('completedAt', value)) ||
                    isNull(value?.completedAt, `completedAt is not null`)) &&
                exists('createdAt', value) &&
                ((value?.updatedAt && exists('updatedAt', value)) ||
                    isNull(value?.updatedAt, `updatedAt is not null`)) &&
                exists('address', value) &&
                value?.address &&
                isAddress(value.address) &&
                exists('customer', value) &&
                value?.customer &&
                isCustomer(value.customer))
    );
}

export function isCustomer(value: ObjTypes): value is TCustomer {
    value = value as TCustomer;
    if (!isObject(value) || 'customerId' in value) {
        // log({ color: "cyan" }, "its definitely not a customer so returning early", {
        //   data: {
        //     object: value,
        //     customerId: 'customerId' in value,
        //   }
        // })
        return false;
    }

    if (value?.addresses) {
        const isArray = Array.isArray(value.addresses);
        const addressesOnlyContainsAddress = value.addresses.every(isAddress);
        if (!isArray || !addressesOnlyContainsAddress) {
            log({ color: 'blue' }, 'isCustomer addresses is', {
                data: {
                    isArray,
                    addressesOnlyContainsAddress,
                },
            });
            return false;
        }
    }

    return Boolean(
        exists('id', value) &&
            exists('firstName', value) &&
            exists('lastName', value) &&
            exists('contact', value) &&
            isBool(value.suspended, `suspended is not a bool`) &&
            ((value?.suspendedAt && exists('suspendedAt', value)) ||
                isNull(
                    value?.suspendedAt,
                    `suspendedAt is not null, ${stringObject(value)}`
                )) &&
            exists('createdAt', value) &&
            ((value?.updatedAt && exists('updatedAt', value)) ||
                isNull(
                    value?.updatedAt,
                    `updatedAt is not null, ${stringObject(value)}`
                ))
        // && exists('addresses', value)
        // && (value?.addresses && Array.isArray(value.addresses) && value.addresses.every(isAddress))
    );
}

function exists(
    key: string,
    object: unknown,
    message = `missing ${key} from object`
) {
    if (!isObject(object)) {
        return false;
    }
    if (
        object &&
        key in (object as Record<string, unknown>) &&
        (object as Record<string, unknown>)[key]
    ) {
        return true;
    }
    log(message, { data: object });
    return false;
}

function isNull(value: unknown, message = 'value is not null') {
    if (value === null) {
        return true;
    }
    log(message);
    return false;
}

function isBool(value: unknown, message?: string) {
    if (value === true || value === false) {
        return true;
    }
    if (message) {
        log(message);
    }
    return false;
}

function isObject(possibleObject: unknown) {
    if (
        typeof possibleObject !== 'object' ||
        possibleObject === null ||
        !possibleObject ||
        Array.isArray(possibleObject)
    ) {
        return false;
    }

    return true;
}

function stringObject(object: unknown) {
    if (isObject(object)) {
        return JSON.stringify(object, null, 2);
    }
    return object;
}
