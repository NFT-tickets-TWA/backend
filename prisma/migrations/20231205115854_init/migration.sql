/*
  Warnings:

  - You are about to drop the column `addres` on the `Location` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Location" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT,
    "room" TEXT,
    "isOffline" BOOLEAN NOT NULL,
    "link" TEXT
);
INSERT INTO "new_Location" ("id", "isOffline", "link", "room") SELECT "id", "isOffline", "link", "room" FROM "Location";
DROP TABLE "Location";
ALTER TABLE "new_Location" RENAME TO "Location";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
