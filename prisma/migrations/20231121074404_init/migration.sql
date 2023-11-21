-- CreateTable
CREATE TABLE "Person" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "walletAddress" TEXT NOT NULL,
    "tgId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "personID" INTEGER NOT NULL,
    "roleID" INTEGER NOT NULL,
    CONSTRAINT "UserRole_personID_fkey" FOREIGN KEY ("personID") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserRole_roleID_fkey" FOREIGN KEY ("roleID") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "NftList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "whiteListId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    CONSTRAINT "NftList_whiteListId_fkey" FOREIGN KEY ("whiteListId") REFERENCES "WhiteList" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "NftList_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "NftStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WhiteList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "personID" INTEGER NOT NULL,
    "eventID" INTEGER NOT NULL,
    CONSTRAINT "WhiteList_personID_fkey" FOREIGN KEY ("personID") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WhiteList_eventID_fkey" FOREIGN KEY ("eventID") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "urlCover" TEXT,
    "description" TEXT,
    "SBTState" BOOLEAN NOT NULL,
    "creatorID" INTEGER NOT NULL,
    "started_at" DATETIME,
    "finished_at" DATETIME,
    "locationID" INTEGER,
    "nftIPFSurl" TEXT NOT NULL,
    "collectionAddr" TEXT,
    "registeredParticipants" INTEGER NOT NULL DEFAULT 0,
    "countOfRewardTokens" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "typeId" INTEGER NOT NULL DEFAULT 1,
    "statusId" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Event_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "EventType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "EventStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_locationID_fkey" FOREIGN KEY ("locationID") REFERENCES "Location" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Event_creatorID_fkey" FOREIGN KEY ("creatorID") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NftStatus" (
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
    "addres" TEXT,
    "room" TEXT,
    "isOffline" BOOLEAN NOT NULL,
    "link" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_walletAddress_key" ON "Person"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Person_tgId_key" ON "Person"("tgId");

-- CreateIndex
CREATE UNIQUE INDEX "NftList_whiteListId_key" ON "NftList"("whiteListId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_nftIPFSurl_key" ON "Event"("nftIPFSurl");

-- CreateIndex
CREATE UNIQUE INDEX "Event_collectionAddr_key" ON "Event"("collectionAddr");
