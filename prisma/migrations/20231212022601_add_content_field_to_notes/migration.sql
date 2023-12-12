/*
  Warnings:

  - Added the required column `content` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customerId" TEXT,
    "addressId" TEXT,
    "appointmentId" TEXT,
    CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Note_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Note_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Note_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Appointment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Note" ("addressId", "appointmentId", "customerId", "id", "userId") SELECT "addressId", "appointmentId", "customerId", "id", "userId" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
CREATE UNIQUE INDEX "Note_userId_key" ON "Note"("userId");
CREATE UNIQUE INDEX "Note_customerId_key" ON "Note"("customerId");
CREATE UNIQUE INDEX "Note_addressId_key" ON "Note"("addressId");
CREATE UNIQUE INDEX "Note_appointmentId_key" ON "Note"("appointmentId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
