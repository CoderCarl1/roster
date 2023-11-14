import { PrismaClient } from "@prisma/client";
import { singleton } from "./singleton.server";

const prisma = singleton(
  "prisma",
  (testing?: string) =>
    new PrismaClient({
      log: testing === "true" ? [] : ["query", "info", "warn", "error"],
    }),
    process.env.TESTING
);
prisma.$connect();

export { prisma };
