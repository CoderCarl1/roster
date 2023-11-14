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
    CONSTRAINT "Address_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Address" ("createdAt", "customerId", "id", "line1", "line2", "number", "suburb", "updatedAt") SELECT "createdAt", "customerId", "id", "line1", "line2", "number", "suburb", "updatedAt" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
CREATE INDEX "Address_customerId_idx" ON "Address"("customerId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
