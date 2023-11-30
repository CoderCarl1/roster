import { Address, Appointment, Customer } from '@prisma/client';
import {
    NotFoundError,
    PrismaClientInitializationError,
    PrismaClientKnownRequestError,
    PrismaClientRustPanicError,
    PrismaClientUnknownRequestError,
    PrismaClientValidationError,
} from '@prisma/client/runtime/library';

export type TCustomer_data_for_creation = Pick<
    Customer,
    'firstName' | 'lastName' | 'contact' | 'note'
>;

export type TAppointment_data_for_creation = Pick<
    Appointment,
    'recurring' | 'frequency' | 'start' | 'end' | 'note'
>;

export type TAddress_data_for_creation = Pick<
    Address,
    'customerId' | 'number' | 'line1' | 'line2' | 'suburb' | 'note'
>;

export type TCustomerDataWithAddresses_for_creation =
    TCustomer_data_for_creation & {
        addresses?: TAddress_data_for_creation[] | Address[];
    };
export type TCustomerDataWithAppointmentsAndAddresses_for_creation =
    TCustomer_data_for_creation & {
        addresses: TAddress_data_for_creation[] | Address[];
        appointments: TAppointment_data_for_creation[] | Appointment[];
    };
export type TCustomer_Appointments_Addresses_for_creation =
    | TCustomer_data_for_creation
    | TCustomerDataWithAddresses_for_creation
    | TCustomerDataWithAppointmentsAndAddresses_for_creation;

export type TCustomer_Appointments_Addresses =
    | Customer
    | (Customer & {
        addresses: Address[];
    })
    | (Customer & {
        addresses: Address[];
        appointments: Appointment[];
    });

export type inclusionTypes = {
    customers?: boolean;
    appointments?: boolean;
    addresses?: boolean;
};

// Types used for Seeding
export type TCustomer_No_ID = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>;
export type TAddress_No_ID = Omit<
    Address,
    'id' | 'customerId' | 'createdAt' | 'updatedAt'
>;
export type TAppointment_No_ID = Omit<
    Appointment,
    'id' | 'createdAt' | 'updatedAt'
>;

type TmockCustomerData = {
    firstName: string;
    lastName: string;
    contact: string;
    note: string;
};
type TmockAddressData = {
    number: string;
    line1: string;
    line2: string;
    suburb: string;
    note: string;
    customerId: null;
};
type TmockAppointment = {
    recurring: boolean;
    frequency: null | number;
    start: string;
    end: string;
    note: string;
};

// Errors

/**
 * Prisma Errors
 */
export type TprismaError =
    | PrismaClientKnownRequestError
    | PrismaClientUnknownRequestError
    | PrismaClientRustPanicError
    | PrismaClientInitializationError
    | PrismaClientValidationError
    | NotFoundError;

export type TprismaErrorDataType = {
    code?: string;
    duplicateField?: Record<string, unknown> | undefined;
    reason?: string;
};
