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
