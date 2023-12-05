/*
  Warnings:

  - You are about to drop the `NftStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NftStatus";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ParticipantStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ParticipantList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "personID" INTEGER NOT NULL,
    "eventID" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    CONSTRAINT "ParticipantList_personID_fkey" FOREIGN KEY ("personID") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ParticipantList_eventID_fkey" FOREIGN KEY ("eventID") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ParticipantList_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "ParticipantStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ParticipantList" ("eventID", "id", "personID", "statusId") SELECT "eventID", "id", "personID", "statusId" FROM "ParticipantListSevice";
DROP TABLE "ParticipantListSevice";
ALTER TABLE "new_ParticipantList" RENAME TO "ParticipantListSevice";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
