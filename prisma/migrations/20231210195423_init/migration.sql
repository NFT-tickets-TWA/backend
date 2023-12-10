-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "urlCover" TEXT,
    "description" TEXT,
    "isSBT" BOOLEAN NOT NULL,
    "creatorID" INTEGER NOT NULL,
    "started_at" DATETIME NOT NULL,
    "finished_at" DATETIME NOT NULL,
    "locationID" INTEGER,
    "nftIpfsUrl" TEXT NOT NULL,
    "contractAddress" TEXT,
    "registeredParticipants" INTEGER NOT NULL DEFAULT 0,
    "countOfRewardTokens" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "typeId" INTEGER NOT NULL DEFAULT 1,
    "statusId" INTEGER NOT NULL DEFAULT 1,
    "approveLink" TEXT,
    CONSTRAINT "Event_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "EventType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "EventStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_locationID_fkey" FOREIGN KEY ("locationID") REFERENCES "Location" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Event_creatorID_fkey" FOREIGN KEY ("creatorID") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("approveLink", "contractAddress", "countOfRewardTokens", "created_at", "creatorID", "description", "finished_at", "id", "isSBT", "locationID", "name", "nftIpfsUrl", "registeredParticipants", "started_at", "statusId", "typeId", "updated_at", "urlCover") SELECT "approveLink", "contractAddress", "countOfRewardTokens", "created_at", "creatorID", "description", "finished_at", "id", "isSBT", "locationID", "name", "nftIpfsUrl", "registeredParticipants", "started_at", "statusId", "typeId", "updated_at", "urlCover" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE UNIQUE INDEX "Event_nftIpfsUrl_key" ON "Event"("nftIpfsUrl");
CREATE UNIQUE INDEX "Event_contractAddress_key" ON "Event"("contractAddress");
CREATE UNIQUE INDEX "Event_approveLink_key" ON "Event"("approveLink");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
