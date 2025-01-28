/*
  Warnings:

  - You are about to drop the column `hunter` on the `Company_Profile` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "companyTier" AS ENUM ('Hunter', 'Holder');

-- AlterTable
ALTER TABLE "Company_Profile" DROP COLUMN "hunter",
ADD COLUMN     "tier" "companyTier" NOT NULL DEFAULT 'Holder';
