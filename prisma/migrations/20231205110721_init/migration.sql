/*
  Warnings:

  - A unique constraint covering the columns `[status]` on the table `ParticipantStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ParticipantStatus_status_key" ON "ParticipantStatus"("status");
