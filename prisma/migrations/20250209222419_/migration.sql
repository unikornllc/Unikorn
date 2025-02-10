/*
  Warnings:

  - You are about to drop the `companyToCompanyTransactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userToCompanyTransactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "companyToCompanyTransactions" DROP CONSTRAINT "companyToCompanyTransactions_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "companyToCompanyTransactions" DROP CONSTRAINT "companyToCompanyTransactions_senderId_fkey";

-- DropForeignKey
ALTER TABLE "userToCompanyTransactions" DROP CONSTRAINT "userToCompanyTransactions_companyId_fkey";

-- DropForeignKey
ALTER TABLE "userToCompanyTransactions" DROP CONSTRAINT "userToCompanyTransactions_userId_fkey";

-- DropTable
DROP TABLE "companyToCompanyTransactions";

-- DropTable
DROP TABLE "userToCompanyTransactions";
