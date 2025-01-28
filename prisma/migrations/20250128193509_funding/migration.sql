/*
  Warnings:

  - You are about to drop the column `userId` on the `Fundraiser` table. All the data in the column will be lost.
  - Added the required column `investorType` to the `Fundraiser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `portions` to the `Fundraiser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerPortion` to the `Fundraiser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerPortion` to the `Raising_Funds` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InvestorType" AS ENUM ('User', 'Company');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('Pending', 'Accepted', 'Rejected');

-- DropForeignKey
ALTER TABLE "Fundraiser" DROP CONSTRAINT "Fundraiser_userId_fkey";

-- AlterTable
ALTER TABLE "Fundraiser" DROP COLUMN "userId",
ADD COLUMN     "investorCompanyId" TEXT,
ADD COLUMN     "investorType" "InvestorType" NOT NULL,
ADD COLUMN     "investorUserId" TEXT,
ADD COLUMN     "portions" INTEGER NOT NULL,
ADD COLUMN     "pricePerPortion" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Raising_Funds" ADD COLUMN     "pricePerPortion" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "InvestmentOffer" (
    "id" TEXT NOT NULL,
    "investorType" "InvestorType" NOT NULL,
    "investorUserId" TEXT,
    "investorCompanyId" TEXT,
    "raisingFundsId" TEXT NOT NULL,
    "portions" INTEGER NOT NULL,
    "offeredPricePerPortion" DOUBLE PRECISION NOT NULL,
    "totalOfferedPrice" DOUBLE PRECISION NOT NULL,
    "status" "OfferStatus" NOT NULL DEFAULT 'Pending',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvestmentOffer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Fundraiser" ADD CONSTRAINT "Fundraiser_investorUserId_fkey" FOREIGN KEY ("investorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fundraiser" ADD CONSTRAINT "Fundraiser_investorCompanyId_fkey" FOREIGN KEY ("investorCompanyId") REFERENCES "Company_Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentOffer" ADD CONSTRAINT "InvestmentOffer_investorUserId_fkey" FOREIGN KEY ("investorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentOffer" ADD CONSTRAINT "InvestmentOffer_investorCompanyId_fkey" FOREIGN KEY ("investorCompanyId") REFERENCES "Company_Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentOffer" ADD CONSTRAINT "InvestmentOffer_raisingFundsId_fkey" FOREIGN KEY ("raisingFundsId") REFERENCES "Raising_Funds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
