/*
  Warnings:

  - You are about to drop the column `statusId` on the `ParticipantList` table. All the data in the column will be lost.
  - Added the required column `statusID` to the `ParticipantList` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ParticipantList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "personID" INTEGER NOT NULL,
    "eventID" INTEGER NOT NULL,
    "statusID" INTEGER NOT NULL,
    CONSTRAINT "ParticipantList_personID_fkey" FOREIGN KEY ("personID") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ParticipantList_eventID_fkey" FOREIGN KEY ("eventID") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ParticipantList_statusID_fkey" FOREIGN KEY ("statusID") REFERENCES "ParticipantStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ParticipantList" ("eventID", "id", "personID") SELECT "eventID", "id", "personID" FROM "ParticipantList";
DROP TABLE "ParticipantList";
ALTER TABLE "new_ParticipantList" RENAME TO "ParticipantList";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
