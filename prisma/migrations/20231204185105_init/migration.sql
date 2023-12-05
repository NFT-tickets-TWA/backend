/*
  Warnings:

  - A unique constraint covering the columns `[approveLink]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN "approveLink" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Event_approveLink_key" ON "Event"("approveLink");
