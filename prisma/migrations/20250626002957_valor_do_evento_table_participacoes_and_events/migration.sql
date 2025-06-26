/*
  Warnings:

  - You are about to drop the column `valor` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "valor",
ADD COLUMN     "valorEvento" INTEGER;
