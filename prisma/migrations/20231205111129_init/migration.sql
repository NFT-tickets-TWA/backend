/*
  Warnings:

  - A unique constraint covering the columns `[personID,eventID]` on the table `ParticipantList` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ParticipantList_personID_eventID_key" ON "ParticipantList"("personID", "eventID");
