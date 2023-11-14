import { PrismaClient } from "@prisma/client";
import { singleton } from "./singleton.server";

const prisma = singleton(
  "prisma",
  (testing?: string) =>
    new PrismaClient({
      log: testing === "true" ? [] : ["query", "info", "warn", "error"],
    }),
  "false",
);
prisma.$connect();

export { prisma };
