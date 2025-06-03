/*
  Warnings:

  - Added the required column `email` to the `Participacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Participacao" ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "imagem" TEXT;
