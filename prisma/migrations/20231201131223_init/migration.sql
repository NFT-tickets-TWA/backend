/*
  Warnings:

  - You are about to alter the column `tgId` on the `Person` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Person" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "walletAddress" TEXT NOT NULL,
    "tgId" BIGINT NOT NULL
);
INSERT INTO "new_Person" ("id", "tgId", "walletAddress") SELECT "id", "tgId", "walletAddress" FROM "Person";
DROP TABLE "Person";
ALTER TABLE "new_Person" RENAME TO "Person";
CREATE UNIQUE INDEX "Person_walletAddress_key" ON "Person"("walletAddress");
CREATE UNIQUE INDEX "Person_tgId_key" ON "Person"("tgId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
