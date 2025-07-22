-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('INVESTMENT', 'FUNDRAISE');

-- AlterEnum
ALTER TYPE "ContractStatus" ADD VALUE 'Negotiating';

-- CreateTable
CREATE TABLE "MonthlyTokens" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "investmentTokensAvailable" INTEGER NOT NULL,
    "fundraisingTokensAvailable" INTEGER NOT NULL,
    "lastReset" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyTokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokensUsageLog" (
    "id" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountId" TEXT NOT NULL,
    "tokenType" "TokenType" NOT NULL,

    CONSTRAINT "TokensUsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyTokens_accountId_key" ON "MonthlyTokens"("accountId");

-- AddForeignKey
ALTER TABLE "MonthlyTokens" ADD CONSTRAINT "MonthlyTokens_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokensUsageLog" ADD CONSTRAINT "TokensUsageLog_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
