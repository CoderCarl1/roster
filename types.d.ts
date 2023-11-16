import { Address, Appointment, Customer } from '@prisma/client';

export type TCustomer_data_for_creation = Omit<
    Customer,
    'id' | 'suspended' | 'suspendedAt' | 'createdAt' | 'updatedAt'
>;

export type TCustomerDataWithAddresses_for_creation =
    TCustomer_data_for_creation & {
        addresses: TAddress_data_for_creation[] | Address[];
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

export type TAppointment_data_for_creation = Omit<
    Appointment,
    'id' | 'customerId' | 'addressId' | 'completed' | 'createdAt' | 'updatedAt'
>;
export type TAddress_data_for_creation = Omit<
    Address,
    'id' | 'customerId' | 'archived' | 'createdAt' | 'updatedAt'
>;

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
