/*
  Warnings:

  - Added the required column `createdAt` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `Password` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Appointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recurring" BOOLEAN NOT NULL DEFAULT false,
    "frequency" INTEGER,
    "customerId" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TEXT,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT,
    CONSTRAINT "Appointment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Appointment_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Appointment" ("addressId", "completed", "completedAt", "createdAt", "customerId", "end", "frequency", "id", "recurring", "start", "updatedAt") SELECT "addressId", "completed", "completedAt", "createdAt", "customerId", "end", "frequency", "id", "recurring", "start", "updatedAt" FROM "Appointment";
DROP TABLE "Appointment";
ALTER TABLE "new_Appointment" RENAME TO "Appointment";
CREATE INDEX "Appointment_customerId_idx" ON "Appointment"("customerId");
CREATE TABLE "new_Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "suspended" BOOLEAN NOT NULL DEFAULT false,
    "suspendedAt" TEXT,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT
);
INSERT INTO "new_Customer" ("contact", "createdAt", "firstName", "id", "lastName", "suspended", "suspendedAt", "updatedAt") SELECT "contact", "createdAt", "firstName", "id", "lastName", "suspended", "suspendedAt", "updatedAt" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE UNIQUE INDEX "Customer_firstName_contact_key" ON "Customer"("firstName", "contact");
CREATE TABLE "new_Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customerId" TEXT,
    "addressId" TEXT,
    "appointmentId" TEXT,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT,
    CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Note_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Note_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Note_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Appointment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Note" ("addressId", "appointmentId", "content", "customerId", "id", "userId") SELECT "addressId", "appointmentId", "content", "customerId", "id", "userId" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
CREATE UNIQUE INDEX "Note_userId_key" ON "Note"("userId");
CREATE UNIQUE INDEX "Note_customerId_key" ON "Note"("customerId");
CREATE UNIQUE INDEX "Note_addressId_key" ON "Note"("addressId");
CREATE UNIQUE INDEX "Note_appointmentId_key" ON "Note"("appointmentId");
CREATE TABLE "new_Password" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT,
    CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Password" ("hash", "id", "userId") SELECT "hash", "id", "userId" FROM "Password";
DROP TABLE "Password";
ALTER TABLE "new_Password" RENAME TO "Password";
CREATE UNIQUE INDEX "Password_userId_key" ON "Password"("userId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT,
    "username" TEXT NOT NULL
);
INSERT INTO "new_User" ("createdAt", "id", "updatedAt", "username") SELECT "createdAt", "id", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE TABLE "new_Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT,
    "number" TEXT,
    "line1" TEXT NOT NULL,
    "line2" TEXT,
    "suburb" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT,
    CONSTRAINT "Address_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Address" ("archived", "createdAt", "customerId", "id", "line1", "line2", "number", "suburb", "updatedAt") SELECT "archived", "createdAt", "customerId", "id", "line1", "line2", "number", "suburb", "updatedAt" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
CREATE INDEX "Address_customerId_idx" ON "Address"("customerId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
