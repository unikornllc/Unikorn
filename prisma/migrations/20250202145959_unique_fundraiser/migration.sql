/*
  Warnings:

  - A unique constraint covering the columns `[raisingFundsId,investorUserId,investorCompanyId]` on the table `Fundraiser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Fundraiser_raisingFundsId_investorUserId_investorCompanyId_key" ON "Fundraiser"("raisingFundsId", "investorUserId", "investorCompanyId");
