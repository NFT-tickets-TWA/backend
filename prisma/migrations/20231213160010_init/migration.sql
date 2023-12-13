-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('NOT_STATED', 'HAKATON', 'CONFERENCE', 'MEETING');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('CREATED', 'REGISTRATION_OPENED', 'REGISTRATION_CLOSED', 'FINISHED');

-- CreateEnum
CREATE TYPE "ParticipantStatus" AS ENUM ('REGISTERED', 'APPROVED', 'RECEIVED_NFT');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('REGISTERED', 'APPROVED', 'RECEIVED_NFT');

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "tgID" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantList" (
    "id" SERIAL NOT NULL,
    "personID" INTEGER NOT NULL,
    "eventID" INTEGER NOT NULL,
    "status" "ParticipantStatus" NOT NULL DEFAULT 'REGISTERED',
    CONSTRAINT "ParticipantList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EventType" NOT NULL DEFAULT 'NOT_STATED',
    "status" "EventStatus" NOT NULL DEFAULT 'REGISTRATION_OPENED',
    "urlCover" TEXT,
    "description" TEXT,
    "isSBT" BOOLEAN NOT NULL,
    "creatorID" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "finishedAt" TIMESTAMP(3) NOT NULL,
    "locationID" INTEGER,
    "nftIpfsUrl" TEXT NOT NULL,
    "contractAddress" TEXT,
    "registeredParticipants" INTEGER NOT NULL DEFAULT 0,
    "countOfRewardTokens" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approveLink" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "address" TEXT,
    "room" TEXT,
    "isOffline" BOOLEAN NOT NULL,
    "link" TEXT,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_walletAddress_key" ON "Person"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Person_tgID_key" ON "Person"("tgID");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantList_personID_eventID_key" ON "ParticipantList"("personID", "eventID");

-- CreateIndex
CREATE UNIQUE INDEX "Event_nftIpfsUrl_key" ON "Event"("nftIpfsUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Event_contractAddress_key" ON "Event"("contractAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Event_approveLink_key" ON "Event"("approveLink");

-- AddForeignKey
ALTER TABLE "ParticipantList" ADD CONSTRAINT "ParticipantList_personID_fkey" FOREIGN KEY ("personID") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantList" ADD CONSTRAINT "ParticipantList_eventID_fkey" FOREIGN KEY ("eventID") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_locationID_fkey" FOREIGN KEY ("locationID") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_creatorID_fkey" FOREIGN KEY ("creatorID") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
