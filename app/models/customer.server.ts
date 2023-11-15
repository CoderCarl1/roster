import { Customer } from "@prisma/client";

import { TCustomer_data_for_creation } from "@types";
import { prisma } from "~/db.server";
import { log } from "~/functions/helpers/functions";
import { customers } from "~/lib/placeholder-data";

/**
 * CREATE
 */
export async function createCustomer(
  customerData: TCustomer_data_for_creation,
): Promise<Customer> {
  return customers[0];
  return await prisma.customer.create({ data: customerData });
}

/**
 * READ
 */

export async function findAllCustomers() {
  const customers = await prisma.customer.findMany({
    where: { suspended: false },
  });
  return customers;
}

export async function findAllCustomers_pagination(
  skip = 0,
  take = 20,
): Promise<Customer[]> {
  const customers = await prisma.customer.findMany({
    skip,
    take,
    where: {
      suspended: false,
    },
  });
  return customers;
}

export async function findCustomer(customerId: string) {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });
  return customer;
}

export async function findCustomer_includeAssociations(customerId: string) {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      appointments: true,
      addresses: true,
    },
  });
  return customer;
}

export async function findAllCustomers_includeAssociations() {
  const customers = await prisma.customer.findMany({
    where: { suspended: false },
    include: {
      appointments: true,
      addresses: true,
    },
  });
  return customers;
}

/**
 * UPDATE
 */
type UpdateCustomerInput = {
  firstName?: string;
  lastName?: string;
  contact?: string;
};

type UpdateAddressInput = {
  id: string;
  number?: string;
  line1?: string;
  line2?: string;
  suburb?: string;
};

type UpdateAppointmentInput = {
  id: string;
  start?: string;
  end?: string;
  completed?: boolean;
};

export async function updateCustomer(
  customerId: string,
  input: UpdateCustomerInput,
  addressInput?: UpdateAddressInput[],
  appointmentInput?: UpdateAppointmentInput[],
): Promise<Customer> {
  await prisma.$transaction([
    prisma.customer.update({
      where: { id: customerId },
      data: input,
    }),
    ...(addressInput
      ? addressInput.map((address) =>
          prisma.address.update({
            where: { id: address.id, customerId },
            data: address,
          }),
        )
      : []),
    ...(appointmentInput
      ? appointmentInput.map((appointment) =>
          prisma.appointment.update({
            where: { id: appointment.id, customerId },
            data: appointment,
          }),
        )
      : []),
  ]);

  const updatedCustomer = await findCustomer_includeAssociations(customerId);

  if (!updatedCustomer) {
    throw new Error(`Customer with ID ${customerId} not found.`);
  }

  console.log(
    `Customer with ID ${customerId} and associated data updated successfully.`,
  );

  return updatedCustomer;
}

export async function removeCustomerSuspension(customerId: string) {
  const customer = await prisma.customer.update({
    where: { id: customerId },
    data: {
      suspended: false,
      suspendedAt: null,
    },
  });

  return customer;
}

/**
 DELETE
 */
export async function suspendCustomer(customerId: string) {
  const suspendedCustomer = await prisma.customer.update({
    where: { id: customerId },
    data: {
      suspended: true,
      suspendedAt: new Date(),
    },
  });

  return suspendedCustomer;
}

export async function customers_deleteAllExamples() {
  await prisma.customer
    .deleteMany({ where: { contact: { endsWith: "example.com" } } })
    .then(() => log("magenta", "DELETED all previous example records"))
    .catch((err) => {
      log("red", "error deleting customers", err);
    });
}
