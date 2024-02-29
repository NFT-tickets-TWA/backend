/*
  Warnings:

  - Added the required column `registrationFinishedAt` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "registrationFinishedAt" TIMESTAMP(3) NOT NULL;
