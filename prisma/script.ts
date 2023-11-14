import { Address, Appointment, Customer } from "@prisma/client";

import { prisma } from "~/db.server";
import { log } from "~/functions/helpers/functions";
import { findAddresses_byCustomer } from "~/models/address";
import { createAppointment } from "~/models/appointments";
import { createCustomer } from "~/models/customer";

import {
  customers,
  addresses,
  appointments,
} from "../app/lib/placeholder-data";

export type TCustomer_No_ID = Omit<Customer, "id" | "createdAt" | "updatedAt">;
export type TAddress_No_ID = Omit<
  Address,
  "id" | "customerId" | "createdAt" | "updatedAt"
>;
export type TAppointment_No_ID = Omit<
  Appointment,
  "id" | "customerId" | "addressId" | "createdAt" | "updatedAt"
>;

async function main() {
  seed();
}

main()
  .catch((error) => {
    log("red", "DB Seed error", error);
  })
  .finally(async () => {
    log("blue", "disconnecting from Prisma client");
    await prisma.$disconnect().then(() => log("yellow", "disconnected"));
  });

async function seed() {
  log("magenta", "==================");
  log("magenta", "cleaning DB before Seeding");
  await prisma.customer
    .deleteMany({ where: { contact: { endsWith: "example.com" } } })
    .then(() => log("magenta", "DELETED all records"))
    .catch((err) => {
      log("red", "error deleting customers", err);
    });

  log("magenta", "creating customers");

  for (const customer of customers) {
    const addressArray = addresses.filter(
      (address) => address.customerId === customer.id,
    );
    const customerAppointments = appointments.filter(
      (appointment) => appointment.customerId === customer.id,
    );

    const customerData: TCustomer_No_ID = prepareDataForSeeding(customer);

    if (addressArray) {
      const addressData: TAddress_No_ID[] = addressArray.map((address) =>
        prepareDataForSeeding(address),
      );
      Object.assign(customerData, { addresses: { create: addressData } });
    }

    const createdCustomer = await createCustomer(customerData);
    if (createdCustomer !== null) {
      const customerAddresses = await findAddresses_byCustomer(
        createdCustomer.id,
      );
      for (const appointment of customerAppointments) {
        const appointmentData: TAppointment_No_ID =
          prepareDataForSeeding(appointment);

        await createAppointment({
          ...appointmentData,
          customerId: createdCustomer.id,
          addressId: customerAddresses[0].id,
        });
      }
    }
  }
  log("green", `Database has been seeded. 🌱`);
  log("magenta", "==================");
}

function prepareDataForSeeding<T extends object>(obj: T) {
  if ("id" in obj) {
    delete obj["id"];
  }
  if ("addressId" in obj) {
    delete obj["addressId"];
  }
  if ("customerId" in obj) {
    delete obj["customerId"];
  }
  if ("createdAt" in obj) {
    delete obj["createdAt"];
  }
  if ("updatedAt" in obj) {
    delete obj["updatedAt"];
  }
  return obj;
}
