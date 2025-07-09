/*
  Warnings:

  - You are about to drop the column `crunchBaseLink` on the `Personnel` table. All the data in the column will be lost.
  - Added the required column `equityPercentage` to the `FundingRound` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `Investment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FundingRound" ADD COLUMN     "equityPercentage" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Investment" ADD COLUMN     "accountId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Personnel" DROP COLUMN "crunchBaseLink",
ADD COLUMN     "linkedInLink" TEXT;

-- AlterTable
ALTER TABLE "ProductInformation" ADD COLUMN     "link" TEXT;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
