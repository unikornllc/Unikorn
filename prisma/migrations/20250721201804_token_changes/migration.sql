-- CreateEnum
CREATE TYPE "TokenAction" AS ENUM ('CONSUME', 'REFUND');

-- AlterEnum
ALTER TYPE "TokenType" ADD VALUE 'OFFER';

-- AlterTable
ALTER TABLE "MonthlyTokens" ALTER COLUMN "investmentTokensAvailable" SET DEFAULT 3,
ALTER COLUMN "fundraisingTokensAvailable" SET DEFAULT 3,
ALTER COLUMN "lastReset" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TokensUsageLog" ADD COLUMN     "action" "TokenAction" NOT NULL DEFAULT 'CONSUME';
