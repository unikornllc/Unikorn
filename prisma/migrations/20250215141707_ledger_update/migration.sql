/*
  Warnings:

  - You are about to drop the column `senderCompanyId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `senderUserId` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_senderCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_senderUserId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "senderCompanyId",
DROP COLUMN "senderUserId",
ADD COLUMN     "companyId" TEXT,
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company_Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
