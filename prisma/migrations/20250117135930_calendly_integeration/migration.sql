/*
  Warnings:

  - You are about to drop the column `calendlyVisibility` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('INVESTOR', 'ENTREPRENEUR', 'USER');

-- AlterTable
ALTER TABLE "Calendly_Integration" ADD COLUMN     "allowedIndustries" TEXT[],
ADD COLUMN     "allowedRoles" "UserRole"[],
ADD COLUMN     "calendlyVisibility" "VisibilityOption" NOT NULL DEFAULT 'PUBLIC',
ADD COLUMN     "minYearsOfOperation" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "calendlyVisibility";
