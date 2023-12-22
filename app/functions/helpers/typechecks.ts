import { TAppointmentWithCustomerNameAndFullAddress, TAddressWithCustomerNameAndFullAddress, TCustomer } from "@types";

type ObjTypes = TAppointmentWithCustomerNameAndFullAddress | TAddressWithCustomerNameAndFullAddress |  TCustomer

export function isAddress(value: ObjTypes): value is TAddressWithCustomerNameAndFullAddress {
  value = value as TAddressWithCustomerNameAndFullAddress;

  return Boolean(
      value?.id &&
      (value?.number === null || value.number) &&
      value?.line1 &&
      (value?.line2 === null || value.line2) &&
      value?.suburb &&
      value?.createdAt &&
      (value?.updatedAt === null || value.updatedAt) &&
      (value?.archived === null || value.archived) &&
      // customer
      (value?.customerId === null || value.customerId) &&
      value?.customer && isCustomer(value.customer) &&
      // appointments
      value?.appointments && Array.isArray(value?.appointments) && value.appointments.forEach(isAppointment)
  )
}

export function isAppointment(value: ObjTypes): value is TAppointmentWithCustomerNameAndFullAddress {
  value = value as TAppointmentWithCustomerNameAndFullAddress

  return Boolean(
      value?.id &&
      value?.recurring &&
      (value?.frequency === null || value.frequency) &&
      value?.customerId &&
      value?.addressId &&
      value?.start &&
      value?.end &&
      value?.completed &&
      (value?.completedAt === null || value.completedAt) &&
      value?.createdAt &&
      (value?.updatedAt === null || value.updatedAt) &&
      value?.address && isAddress(value.address) &&
      value?.customer && isCustomer(value.customer)
  );
}

export function isCustomer(value: ObjTypes): value is TCustomer {
  value = value as TCustomer;
  return Boolean(
      value &&
      value?.id &&
      value?.firstName &&
      value?.lastName &&
      value?.contact &&
      value?.suspended &&
      (value?.suspendedAt === null || value.suspendedAt) &&
      value?.createdAt &&
      (value?.updatedAt === null || value.updatedAt) &&
      // addresses
      value?.addresses && Array.isArray(value.addresses) && value.addresses.forEach(isAddress)
  );
}


