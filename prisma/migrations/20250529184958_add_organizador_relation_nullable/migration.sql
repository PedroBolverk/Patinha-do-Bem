-- AlterTable
ALTER TABLE "events" ADD COLUMN     "organizadorId" INTEGER;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organizadorId_fkey" FOREIGN KEY ("organizadorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
