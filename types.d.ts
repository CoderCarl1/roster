import { Address, Appointment, Customer } from "@prisma/client";

export type TCustomer_data_for_creation = Omit<
  Customer,
  "id" | "suspended" | "suspendedAt" | "createdAt" | "updatedAt"
>;
export type TAppointment_data_for_creation = Omit<
  Appointment,
  "id" | "completed" | "createdAt" | "updatedAt"
>;
export type TAddress_data_for_creation = Omit<
  Address,
  "id" | "createdAt" | "updatedAt"
>;

// Types used for Seeding
export type TCustomer_No_ID = Omit<Customer, "id" | "createdAt" | "updatedAt">;
export type TAddress_No_ID = Omit<
  Address,
  "id" | "customerId" | "createdAt" | "updatedAt"
>;
export type TAppointment_No_ID = Omit<
  Appointment,
  "id" | "customerId" | "addressId" | "createdAt" | "updatedAt"
>;
