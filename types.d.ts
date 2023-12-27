import {
    Address,
    Appointment,
    Customer,
    Note,
    Prisma,
    User,
} from '@prisma/client';
import {
    NotFoundError,
    PrismaClientInitializationError,
    PrismaClientKnownRequestError,
    PrismaClientRustPanicError,
    PrismaClientUnknownRequestError,
    PrismaClientValidationError,
} from '@prisma/client/runtime/library';

type optionalFullName = {
    fullName?: string | undefined | null;
};
type optionalFullAddress = {
    fullAddress?: string | undefined | null;
};

type optionalCustomer = { customer?: TCustomer };
type optionalAddress = { address?: TAddress };

export type TCustomer = {
    appointments?: TAppointmentWithCustomerNameAndFullAddress[];
    addresses?: TAddressWithCustomerNameAndFullAddress[];
} & Customer &
    optionalFullName &
    optionalFullAddress;

export type TAddress = {
    appointments?: TAppointmentWithCustomerNameAndFullAddress[];
} & optionalCustomer &
    Address;
export type TAddressWithCustomerName = optionalFullName & TAddress;
export type TAddressWithFullAddress = optionalFullAddress & TAddress;

export type TAddressWithCustomerNameAndFullAddress = optionalFullName &
    optionalFullAddress &
    TAddress;

export type TAppointment = optionalCustomer & optionalAddress & Appointment & {
    localTime?: {
        start: string;
        end: string;
        completedAt: string; // Adjust the type accordingly
      };
};
export type TAppointmentWithCustomerName = optionalFullName & TAppointment;
export type TAppointmentWithCustomerNameAndFullAddress =
    TAppointmentWithCustomerName & optionalFullAddress;

export type TCustomer_data_for_creation = Pick<
    Customer,
    'firstName' | 'lastName' | 'contact'
>;

export type TAppointment_data_for_creation = Pick<
    Appointment,
    'recurring' | 'frequency' | 'start' | 'end'
>;

export type TAddress_data_for_creation = Pick<
    Address,
    'customerId' | 'number' | 'line1' | 'line2' | 'suburb'
>;

export type TNote_data_for_creation = Pick<Note, 'userId' | 'content'> &
    Partial<Pick<Note, 'customerId' | 'appointmentId' | 'addressId'>>;

export type TUser_data_for_creation = Pick<User, 'username'>;

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

// Types used for Seeding
export type TCustomer_No_ID = Omit<Customer, 'id'>;
export type TAddress_No_ID = Omit<Address, 'id' | 'customerId'>;
export type TAppointment_No_ID = Omit<
    Appointment,
    'id' | 'customerId' | 'addressId'
>;

type TmockCustomerData = {
    firstName: string;
    lastName: string;
    contact: string;
    note?: Note;
};
type TmockAddressData = {
    number: string;
    line1: string;
    line2: string;
    suburb: string;
    note?: Note;
    customerId: null;
};
type TmockAppointmentData = {
    recurring: boolean;
    frequency: null | number;
    start: string;
    end: string;
    note?: Note;
};
type TmockNote = Pick<
    Note,
    'userId' | 'customerId' | 'appointmentId' | 'addressId' | 'content'
>;

type TmockUser = Pick<User, 'username'>;

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



// make sure css variables are accepted
declare module 'react' {
    interface CSSProperties {
        [key: `--${string}`]: string | number
    }
}