import { PrismaClient } from "@prisma/client";
import { singleton } from "./singleton.server";

const prisma = singleton(
  "prisma",
  () =>
    new PrismaClient({
      log: ["query", "info", "warn", "error"],
    }),
);
prisma.$connect();

export { prisma };
