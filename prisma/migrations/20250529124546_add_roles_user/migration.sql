-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ORGANIZADOR', 'COMUM');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'COMUM';
