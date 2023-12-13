/*
  Warnings:

  - You are about to drop the column `created_at` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `finished_at` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `started_at` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `tgId` on the `Person` table. All the data in the column will be lost.
  - Added the required column `finishedAt` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startedAt` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tgID` to the `Person` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "urlCover" TEXT,
    "description" TEXT,
    "isSBT" BOOLEAN NOT NULL,
    "creatorID" INTEGER NOT NULL,
    "startedAt" DATETIME NOT NULL,
    "finishedAt" DATETIME NOT NULL,
    "locationID" INTEGER,
    "nftIpfsUrl" TEXT NOT NULL,
    "contractAddress" TEXT,
    "registeredParticipants" INTEGER NOT NULL DEFAULT 0,
    "countOfRewardTokens" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "typeID" INTEGER NOT NULL DEFAULT 1,
    "statusID" INTEGER NOT NULL DEFAULT 1,
    "approveLink" TEXT,
    CONSTRAINT "Event_typeID_fkey" FOREIGN KEY ("typeID") REFERENCES "EventType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_statusID_fkey" FOREIGN KEY ("statusID") REFERENCES "EventStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_locationID_fkey" FOREIGN KEY ("locationID") REFERENCES "Location" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Event_creatorID_fkey" FOREIGN KEY ("creatorID") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("approveLink", "contractAddress", "countOfRewardTokens", "creatorID", "description", "id", "isSBT", "locationID", "name", "nftIpfsUrl", "registeredParticipants", "urlCover") SELECT "approveLink", "contractAddress", "countOfRewardTokens", "creatorID", "description", "id", "isSBT", "locationID", "name", "nftIpfsUrl", "registeredParticipants", "urlCover" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE UNIQUE INDEX "Event_nftIpfsUrl_key" ON "Event"("nftIpfsUrl");
CREATE UNIQUE INDEX "Event_contractAddress_key" ON "Event"("contractAddress");
CREATE UNIQUE INDEX "Event_approveLink_key" ON "Event"("approveLink");
CREATE TABLE "new_Person" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "walletAddress" TEXT NOT NULL,
    "tgID" TEXT NOT NULL
);
INSERT INTO "new_Person" ("id", "walletAddress") SELECT "id", "walletAddress" FROM "Person";
DROP TABLE "Person";
ALTER TABLE "new_Person" RENAME TO "Person";
CREATE UNIQUE INDEX "Person_walletAddress_key" ON "Person"("walletAddress");
CREATE UNIQUE INDEX "Person_tgID_key" ON "Person"("tgID");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
