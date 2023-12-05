/*
  Warnings:

  - You are about to drop the `NftList` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WhiteList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NftList";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "WhiteList";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ParticipantListSevice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "personID" INTEGER NOT NULL,
    "eventID" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    CONSTRAINT "ParticipantList_personID_fkey" FOREIGN KEY ("personID") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ParticipantList_eventID_fkey" FOREIGN KEY ("eventID") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ParticipantList_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "NftStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
