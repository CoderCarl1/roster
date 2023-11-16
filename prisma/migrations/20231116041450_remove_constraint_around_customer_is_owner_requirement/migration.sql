/*
  Warnings:

  - You are about to drop the column `customerIsOwner` on the `Appointment` table. All the data in the column will be lost.

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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Appointment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Appointment_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Appointment" ("addressId", "completed", "createdAt", "customerId", "end", "frequency", "id", "recurring", "start", "updatedAt") SELECT "addressId", "completed", "createdAt", "customerId", "end", "frequency", "id", "recurring", "start", "updatedAt" FROM "Appointment";
DROP TABLE "Appointment";
ALTER TABLE "new_Appointment" RENAME TO "Appointment";
CREATE INDEX "Appointment_customerId_idx" ON "Appointment"("customerId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
