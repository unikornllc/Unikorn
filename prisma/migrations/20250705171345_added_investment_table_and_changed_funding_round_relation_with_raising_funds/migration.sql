/*
  Warnings:

  - You are about to drop the column `raisingFundsId` on the `FundingRound` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[investmentId]` on the table `Fundraiser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fundingRoundId]` on the table `RaisingFunds` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "FundingRound" DROP CONSTRAINT "FundingRound_raisingFundsId_fkey";

-- AlterTable
ALTER TABLE "FundingRound" DROP COLUMN "raisingFundsId";

-- AlterTable
ALTER TABLE "Fundraiser" ADD COLUMN     "investmentId" TEXT,
ALTER COLUMN "envelopeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RaisingFunds" ADD COLUMN     "fundingRoundId" TEXT;

-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "equityPercentage" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fundraiser_investmentId_key" ON "Fundraiser"("investmentId");

-- CreateIndex
CREATE UNIQUE INDEX "RaisingFunds_fundingRoundId_key" ON "RaisingFunds"("fundingRoundId");

-- AddForeignKey
ALTER TABLE "RaisingFunds" ADD CONSTRAINT "RaisingFunds_fundingRoundId_fkey" FOREIGN KEY ("fundingRoundId") REFERENCES "FundingRound"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fundraiser" ADD CONSTRAINT "Fundraiser_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "Investment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
