-- AlterTable
ALTER TABLE "ChatParticipant" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "FundingRound" ADD COLUMN     "raisingFundsId" TEXT;

-- AddForeignKey
ALTER TABLE "FundingRound" ADD CONSTRAINT "FundingRound_raisingFundsId_fkey" FOREIGN KEY ("raisingFundsId") REFERENCES "RaisingFunds"("id") ON DELETE SET NULL ON UPDATE CASCADE;
