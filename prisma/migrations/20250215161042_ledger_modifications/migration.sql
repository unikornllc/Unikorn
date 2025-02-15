/*
  Warnings:

  - You are about to drop the `JournalEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LedgerEntry` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[raisingFundsId]` on the table `Journal` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `flowType` to the `Journal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FlowType" AS ENUM ('Wallet_Deposit', 'Wallet_Withdraw', 'Investment_Flow');

-- DropForeignKey
ALTER TABLE "JournalEntry" DROP CONSTRAINT "JournalEntry_journalId_fkey";

-- DropForeignKey
ALTER TABLE "JournalEntry" DROP CONSTRAINT "JournalEntry_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "LedgerEntry" DROP CONSTRAINT "LedgerEntry_journalId_fkey";

-- DropForeignKey
ALTER TABLE "LedgerEntry" DROP CONSTRAINT "LedgerEntry_ledgerId_fkey";

-- DropForeignKey
ALTER TABLE "LedgerEntry" DROP CONSTRAINT "LedgerEntry_transactionId_fkey";

-- AlterTable
ALTER TABLE "Journal" ADD COLUMN     "flowType" "FlowType" NOT NULL,
ADD COLUMN     "raisingFundsId" TEXT;

-- DropTable
DROP TABLE "JournalEntry";

-- DropTable
DROP TABLE "LedgerEntry";

-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "entryType" "EntryType" NOT NULL,
    "journalId" TEXT NOT NULL,
    "ledgerId" TEXT NOT NULL,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Journal_raisingFundsId_key" ON "Journal"("raisingFundsId");

-- AddForeignKey
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_raisingFundsId_fkey" FOREIGN KEY ("raisingFundsId") REFERENCES "Raising_Funds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "Journal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_ledgerId_fkey" FOREIGN KEY ("ledgerId") REFERENCES "LedgerAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
