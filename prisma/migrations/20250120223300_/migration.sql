-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('Pro', 'Standard');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tier" "Tier" NOT NULL DEFAULT 'Standard';
