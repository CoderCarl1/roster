import { Address, Appointment } from "@prisma/client";

import { TAddress_data_for_creation } from "@types";
import { prisma } from "~/db.server";
/**
 * CREATE
 */
export async function createAddress(
  addressData: TAddress_data_for_creation,
): Promise<Address | null> {
  try {
    const address = await prisma.address.create({
      data: addressData,
    });
    return address;
  } catch (error) {
    console.error("Error creating address:", error);
    return null;
  }
}
/**
 * READ
 */

export async function findAddress(
  searchString: string,
): Promise<Address | null> {
  const address = await prisma.address.findFirst({
    where: {
      OR: [
        { number: { contains: searchString } },
        { line1: { contains: searchString } },
        { line2: { contains: searchString } },
        { suburb: { contains: searchString } },
      ],
    },
  });

  return address;
}

export async function findAddresses_all(): Promise<Address[]> {
  const addresses = await prisma.address.findMany();
  return addresses;
}

export async function findAddresses_byCustomer(
  customerId: string,
): Promise<Address[]> {
  const addresses = await prisma.address.findMany({
    include: { Customer: true },
    where: {
      customerId: customerId,
    },
  });
  return addresses;
}

/**
 * UPDATE
 */

type UpdateAddressInput = {
  id: string;
  customerId?: string;
  number?: string;
  line1?: string;
  line2?: string;
  suburb?: string;
  Appointments?: Appointment[];
};
export async function updateAddress({
  id,
  ...args
}: UpdateAddressInput): Promise<Address> {
  await prisma.address.update({
    where: { id },
    data: args as any,
  });

  const updatedAddress = await prisma.address.findUnique({
    where: { id },
  });

  if (!updatedAddress) {
    throw new Error(`Address with ID ${id} not found.`);
  }

  console.log(
    `Customer with ID ${id} and associated data updated successfully.`,
  );

  return updatedAddress;
}
/**
 * DELETE
 */
