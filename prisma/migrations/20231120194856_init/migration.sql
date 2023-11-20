/*
  Warnings:

  - You are about to drop the column `name` on the `Person` table. All the data in the column will be lost.
  - Added the required column `tgId` to the `Person` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Person" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "walletAdress" TEXT NOT NULL,
    "tgId" TEXT NOT NULL
);
INSERT INTO "new_Person" ("id", "walletAdress") SELECT "id", "walletAdress" FROM "Person";
DROP TABLE "Person";
ALTER TABLE "new_Person" RENAME TO "Person";
CREATE UNIQUE INDEX "Person_walletAdress_key" ON "Person"("walletAdress");
CREATE UNIQUE INDEX "Person_tgId_key" ON "Person"("tgId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
