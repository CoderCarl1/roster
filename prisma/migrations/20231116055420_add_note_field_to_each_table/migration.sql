/*
  Warnings:

  - Added the required column `note` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `note` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `note` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "number" TEXT,
    "line1" TEXT NOT NULL,
    "line2" TEXT NOT NULL,
    "suburb" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "note" TEXT NOT NULL,
    CONSTRAINT "Address_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Address" ("archived", "createdAt", "customerId", "id", "line1", "line2", "number", "suburb", "updatedAt") SELECT "archived", "createdAt", "customerId", "id", "line1", "line2", "number", "suburb", "updatedAt" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
CREATE INDEX "Address_customerId_idx" ON "Address"("customerId");
CREATE TABLE "new_Appointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recurring" BOOLEAN NOT NULL DEFAULT false,
    "frequency" INTEGER,
    "customerId" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "note" TEXT NOT NULL,
    CONSTRAINT "Appointment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Appointment_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Appointment" ("addressId", "completed", "createdAt", "customerId", "end", "frequency", "id", "recurring", "start", "updatedAt") SELECT "addressId", "completed", "createdAt", "customerId", "end", "frequency", "id", "recurring", "start", "updatedAt" FROM "Appointment";
DROP TABLE "Appointment";
ALTER TABLE "new_Appointment" RENAME TO "Appointment";
CREATE INDEX "Appointment_customerId_idx" ON "Appointment"("customerId");
CREATE TABLE "new_Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "suspended" BOOLEAN NOT NULL DEFAULT false,
    "suspendedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "note" TEXT NOT NULL
);
INSERT INTO "new_Customer" ("contact", "createdAt", "firstName", "id", "lastName", "suspended", "suspendedAt", "updatedAt") SELECT "contact", "createdAt", "firstName", "id", "lastName", "suspended", "suspendedAt", "updatedAt" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE UNIQUE INDEX "Customer_firstName_contact_key" ON "Customer"("firstName", "contact");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
