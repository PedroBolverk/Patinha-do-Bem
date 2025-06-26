/*
  Warnings:

  - You are about to drop the column `amount` on the `Participacao` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Participacao" DROP COLUMN "amount",
ADD COLUMN     "valorEvento" INTEGER;
