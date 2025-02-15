/*
  Warnings:

  - You are about to drop the column `totalBalance` on the `Journal` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Journal` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Journal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_userId_fkey";

-- AlterTable
ALTER TABLE "Journal" DROP COLUMN "totalBalance",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "companyId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Journal_name_key" ON "Journal"("name");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company_Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
