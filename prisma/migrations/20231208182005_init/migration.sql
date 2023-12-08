-- CreateTable
CREATE TABLE "Person" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "walletAddress" TEXT NOT NULL,
    "tgId" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    CONSTRAINT "Person_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ParticipantList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "personID" INTEGER NOT NULL,
    "eventID" INTEGER NOT NULL,
    "statusID" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "ParticipantList_personID_fkey" FOREIGN KEY ("personID") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ParticipantList_eventID_fkey" FOREIGN KEY ("eventID") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ParticipantList_statusID_fkey" FOREIGN KEY ("statusID") REFERENCES "ParticipantStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "urlCover" TEXT,
    "description" TEXT,
    "isSBT" BOOLEAN NOT NULL,
    "creatorID" INTEGER NOT NULL,
    "started_at" DATETIME,
    "finished_at" DATETIME,
    "locationID" INTEGER,
    "nftIpfsUrl" TEXT NOT NULL,
    "collectionAddr" TEXT,
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

-- CreateTable
CREATE TABLE "ParticipantStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "EventType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "EventStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Location" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT,
    "room" TEXT,
    "isOffline" BOOLEAN NOT NULL,
    "link" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_walletAddress_key" ON "Person"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Person_tgId_key" ON "Person"("tgId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantList_personID_eventID_key" ON "ParticipantList"("personID", "eventID");

-- CreateIndex
CREATE UNIQUE INDEX "Event_nftIpfsUrl_key" ON "Event"("nftIpfsUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Event_collectionAddr_key" ON "Event"("collectionAddr");

-- CreateIndex
CREATE UNIQUE INDEX "Event_approveLink_key" ON "Event"("approveLink");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantStatus_status_key" ON "ParticipantStatus"("status");
