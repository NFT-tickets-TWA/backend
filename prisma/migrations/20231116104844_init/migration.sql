-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "urlCover" TEXT,
    "description" TEXT,
    "creatorID" INTEGER NOT NULL,
    "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locationID" INTEGER,
    "nftPattern" TEXT,
    "collectionAddr" TEXT,
    "registeredParticipants" INTEGER NOT NULL DEFAULT 0,
    "countOfRewardTokens" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "typeId" INTEGER NOT NULL DEFAULT 1,
    "statusId" INTEGER NOT NULL DEFAULT 1,
    "symbol" TEXT NOT NULL,
    CONSTRAINT "Event_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "EventType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "EventStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_locationID_fkey" FOREIGN KEY ("locationID") REFERENCES "Location" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Event_creatorID_fkey" FOREIGN KEY ("creatorID") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("collectionAddr", "countOfRewardTokens", "created_at", "creatorID", "description", "finished_at", "id", "locationID", "name", "nftPattern", "registeredParticipants", "started_at", "statusId", "symbol", "typeId", "updated_at", "urlCover") SELECT "collectionAddr", "countOfRewardTokens", "created_at", "creatorID", "description", "finished_at", "id", "locationID", "name", "nftPattern", "registeredParticipants", "started_at", "statusId", "symbol", "typeId", "updated_at", "urlCover" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE UNIQUE INDEX "Event_nftPattern_key" ON "Event"("nftPattern");
CREATE UNIQUE INDEX "Event_collectionAddr_key" ON "Event"("collectionAddr");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
