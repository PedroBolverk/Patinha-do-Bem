/*
  Warnings:

  - Made the column `organizadorId` on table `events` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_organizadorId_fkey";

-- AlterTable
ALTER TABLE "events" ALTER COLUMN "organizadorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organizadorId_fkey" FOREIGN KEY ("organizadorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
