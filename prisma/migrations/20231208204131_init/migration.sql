/*
  Warnings:

  - You are about to drop the column `roleId` on the `Person` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "UserRole" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "personID" INTEGER NOT NULL,
    "roleID" INTEGER NOT NULL,
    CONSTRAINT "UserRole_personID_fkey" FOREIGN KEY ("personID") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserRole_roleID_fkey" FOREIGN KEY ("roleID") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Person" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "walletAddress" TEXT NOT NULL,
    "tgId" TEXT NOT NULL
);
INSERT INTO "new_Person" ("id", "tgId", "walletAddress") SELECT "id", "tgId", "walletAddress" FROM "Person";
DROP TABLE "Person";
ALTER TABLE "new_Person" RENAME TO "Person";
CREATE UNIQUE INDEX "Person_walletAddress_key" ON "Person"("walletAddress");
CREATE UNIQUE INDEX "Person_tgId_key" ON "Person"("tgId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
