/*
  Warnings:

  - You are about to drop the column `location` on the `Raising_Funds` table. All the data in the column will be lost.
  - The `status` column on the `Raising_Funds` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Contract_Status" AS ENUM ('Pending', 'Active', 'Completed', 'Failed');

-- AlterTable
ALTER TABLE "Financial" ALTER COLUMN "valuation" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "total_funding_amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Funding_Round" ALTER COLUMN "funding_amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Raising_Funds" DROP COLUMN "location",
ADD COLUMN     "remainingPortions" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "totalPortions" INTEGER NOT NULL DEFAULT 10,
ALTER COLUMN "fundingAmount" SET DATA TYPE DOUBLE PRECISION,
DROP COLUMN "status",
ADD COLUMN     "status" "Contract_Status" NOT NULL DEFAULT 'Pending';

-- CreateTable
CREATE TABLE "Fundraiser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "raisingFundsId" TEXT NOT NULL,
    "equityPercentage" DOUBLE PRECISION NOT NULL,
    "fundingAmount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "Contract_Status" NOT NULL DEFAULT 'Pending',
    "envelopeId" TEXT NOT NULL,

    CONSTRAINT "Fundraiser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fundraiser_envelopeId_key" ON "Fundraiser"("envelopeId");

-- AddForeignKey
ALTER TABLE "Fundraiser" ADD CONSTRAINT "Fundraiser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fundraiser" ADD CONSTRAINT "Fundraiser_raisingFundsId_fkey" FOREIGN KEY ("raisingFundsId") REFERENCES "Raising_Funds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
