/*
  Warnings:

  - You are about to drop the column `total_funding_amount` on the `Financial` table. All the data in the column will be lost.
  - You are about to drop the column `FollowercompanyId` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `FolloweruserId` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `FollowingcompanyId` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `FollowinguserId` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `crunch_base_link` on the `Founder` table. All the data in the column will be lost.
  - The `status` column on the `Fundraiser` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `proficiency` column on the `Language` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `companyId` on the `LedgerAccount` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `LedgerAccount` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `LoginDevices` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `LoginDevices` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the `Calendly_Integration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Certifications_Courses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Company_File` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Company_Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Corporate_Experience` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Entrepreneur` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Funding_Round` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Investor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Key_Employees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product_Information` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Raising_Funds` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Social_Media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Startup_Experience` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_File` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[accountId]` on the table `LedgerAccount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ip,browser,os,accountId]` on the table `LoginDevices` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accountId]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `totalFundingAmount` to the `Financial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `crunchBaseLink` to the `Founder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `LedgerAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `LoginDevices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('Pending', 'Active', 'Completed', 'Failed');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('User', 'Company');

-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('Profit', 'NonProfit', 'Private', 'Public');

-- CreateEnum
CREATE TYPE "CompanyTier" AS ENUM ('Hunter', 'Holder');

-- CreateEnum
CREATE TYPE "LanguageProficiency" AS ENUM ('Beginner', 'Intermediate', 'Proficient');

-- CreateEnum
CREATE TYPE "SocialMediaPlatforms" AS ENUM ('LinkedIn', 'X', 'Meetup');

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Calendly_Integration" DROP CONSTRAINT "Calendly_Integration_userId_fkey";

-- DropForeignKey
ALTER TABLE "Certifications_Courses" DROP CONSTRAINT "Certifications_Courses_userId_fkey";

-- DropForeignKey
ALTER TABLE "Company_File" DROP CONSTRAINT "Company_File_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Corporate_Experience" DROP CONSTRAINT "Corporate_Experience_userId_fkey";

-- DropForeignKey
ALTER TABLE "Financial" DROP CONSTRAINT "Financial_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_FollowercompanyId_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_FolloweruserId_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_FollowingcompanyId_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_FollowinguserId_fkey";

-- DropForeignKey
ALTER TABLE "Founder" DROP CONSTRAINT "Founder_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Funding_Round" DROP CONSTRAINT "Funding_Round_financialId_fkey";

-- DropForeignKey
ALTER TABLE "Fundraiser" DROP CONSTRAINT "Fundraiser_investorCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "Fundraiser" DROP CONSTRAINT "Fundraiser_raisingFundsId_fkey";

-- DropForeignKey
ALTER TABLE "InvestmentOffer" DROP CONSTRAINT "InvestmentOffer_investorCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "InvestmentOffer" DROP CONSTRAINT "InvestmentOffer_raisingFundsId_fkey";

-- DropForeignKey
ALTER TABLE "Journal" DROP CONSTRAINT "Journal_raisingFundsId_fkey";

-- DropForeignKey
ALTER TABLE "Key_Employees" DROP CONSTRAINT "Key_Employees_companyId_fkey";

-- DropForeignKey
ALTER TABLE "LedgerAccount" DROP CONSTRAINT "LedgerAccount_companyId_fkey";

-- DropForeignKey
ALTER TABLE "LedgerAccount" DROP CONSTRAINT "LedgerAccount_userId_fkey";

-- DropForeignKey
ALTER TABLE "LoginDevices" DROP CONSTRAINT "LoginDevices_companyId_fkey";

-- DropForeignKey
ALTER TABLE "LoginDevices" DROP CONSTRAINT "LoginDevices_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Product_Information" DROP CONSTRAINT "Product_Information_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Raising_Funds" DROP CONSTRAINT "Raising_Funds_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Social_Media" DROP CONSTRAINT "Social_Media_userId_fkey";

-- DropForeignKey
ALTER TABLE "Startup_Experience" DROP CONSTRAINT "Startup_Experience_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "User_File" DROP CONSTRAINT "User_File_userId_fkey";

-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_userId_fkey";

-- DropIndex
DROP INDEX "LedgerAccount_companyId_key";

-- DropIndex
DROP INDEX "LedgerAccount_userId_key";

-- DropIndex
DROP INDEX "LoginDevices_ip_browser_os_userId_companyId_key";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_username_key";

-- DropIndex
DROP INDEX "Wallet_companyId_key";

-- DropIndex
DROP INDEX "Wallet_userId_key";

-- AlterTable
ALTER TABLE "Financial" DROP COLUMN "total_funding_amount",
ADD COLUMN     "totalFundingAmount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Follow" DROP COLUMN "FollowercompanyId",
DROP COLUMN "FolloweruserId",
DROP COLUMN "FollowingcompanyId",
DROP COLUMN "FollowinguserId",
ADD COLUMN     "followerId" TEXT,
ADD COLUMN     "followingId" TEXT;

-- AlterTable
ALTER TABLE "Founder" DROP COLUMN "crunch_base_link",
ADD COLUMN     "crunchBaseLink" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Fundraiser" DROP COLUMN "status",
ADD COLUMN     "status" "ContractStatus" NOT NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "Language" DROP COLUMN "proficiency",
ADD COLUMN     "proficiency" "LanguageProficiency" NOT NULL DEFAULT 'Beginner';

-- AlterTable
ALTER TABLE "LedgerAccount" DROP COLUMN "companyId",
DROP COLUMN "userId",
ADD COLUMN     "accountId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LoginDevices" DROP COLUMN "companyId",
DROP COLUMN "userId",
ADD COLUMN     "accountId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "companyId",
DROP COLUMN "userId",
ADD COLUMN     "accountId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "password",
DROP COLUMN "username",
DROP COLUMN "verified",
ALTER COLUMN "description" SET DATA TYPE VARCHAR(600);

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "companyId",
DROP COLUMN "userId",
ADD COLUMN     "accountId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Calendly_Integration";

-- DropTable
DROP TABLE "Certifications_Courses";

-- DropTable
DROP TABLE "Company_File";

-- DropTable
DROP TABLE "Company_Profile";

-- DropTable
DROP TABLE "Corporate_Experience";

-- DropTable
DROP TABLE "Entrepreneur";

-- DropTable
DROP TABLE "Funding_Round";

-- DropTable
DROP TABLE "Investor";

-- DropTable
DROP TABLE "Key_Employees";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "Product_Information";

-- DropTable
DROP TABLE "Raising_Funds";

-- DropTable
DROP TABLE "Social_Media";

-- DropTable
DROP TABLE "Startup_Experience";

-- DropTable
DROP TABLE "User_File";

-- DropEnum
DROP TYPE "Company_Type";

-- DropEnum
DROP TYPE "Contract_Status";

-- DropEnum
DROP TYPE "Language_Proficiency";

-- DropEnum
DROP TYPE "Social_Media_Platforms";

-- DropEnum
DROP TYPE "Status";

-- DropEnum
DROP TYPE "companyTier";

-- CreateTable
CREATE TABLE "RaisingFunds" (
    "id" TEXT NOT NULL,
    "equityPercentage" DOUBLE PRECISION NOT NULL,
    "fundingAmount" DOUBLE PRECISION NOT NULL,
    "pricePerPortion" DOUBLE PRECISION NOT NULL,
    "remainingPortions" INTEGER NOT NULL DEFAULT 10,
    "totalPortions" INTEGER NOT NULL DEFAULT 10,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'Pending',
    "envelopeId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "RaisingFunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundingRound" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "fundingAmount" DOUBLE PRECISION NOT NULL,
    "roundDate" TIMESTAMP(3) NOT NULL,
    "leadInvestors" TEXT[],
    "financialId" TEXT NOT NULL,

    CONSTRAINT "FundingRound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" "AccountType" NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendlyIntegration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "calendlyVisibility" "VisibilityOption" NOT NULL DEFAULT 'PUBLIC',
    "allowedIndustries" TEXT[],
    "minYearsOfOperation" INTEGER,
    "allowedRoles" "UserRole"[],
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "tokenType" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "scope" TEXT NOT NULL,
    "calendlyUserURI" TEXT NOT NULL,
    "calendlyOrgURI" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendlyIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" VARCHAR(600) NOT NULL,
    "website" TEXT NOT NULL,
    "founded" TIMESTAMP(3) NOT NULL,
    "type" "CompanyType" NOT NULL DEFAULT 'Public',
    "hqLocation" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "tier" "CompanyTier" NOT NULL DEFAULT 'Holder',
    "boardMembers" TEXT[],
    "advisors" TEXT[],

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeyEmployees" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "KeyEmployees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductInformation" (
    "id" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "partnerships" TEXT[],
    "companyId" TEXT NOT NULL,

    CONSTRAINT "ProductInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyFile" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "CompanyFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorporateExperience" (
    "id" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "responsibilities" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CorporateExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StartupExperience" (
    "id" TEXT NOT NULL,
    "startupName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "StartupExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificationsCourses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "completionDate" TIMESTAMP(3) NOT NULL,
    "focusArea" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CertificationsCourses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialMedia" (
    "id" TEXT NOT NULL,
    "platform" "SocialMediaPlatforms" NOT NULL DEFAULT 'X',
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SocialMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFile" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RaisingFunds_envelopeId_key" ON "RaisingFunds"("envelopeId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_id_key" ON "Account"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Account_username_key" ON "Account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_mobileNumber_key" ON "Account"("mobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CalendlyIntegration_userId_key" ON "CalendlyIntegration"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyFile_fileName_companyId_key" ON "CompanyFile"("fileName", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFile_fileName_userId_key" ON "UserFile"("fileName", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerAccount_accountId_key" ON "LedgerAccount"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "LoginDevices_ip_browser_os_accountId_key" ON "LoginDevices"("ip", "browser", "os", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_accountId_key" ON "Wallet"("accountId");

-- AddForeignKey
ALTER TABLE "RaisingFunds" ADD CONSTRAINT "RaisingFunds_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fundraiser" ADD CONSTRAINT "Fundraiser_investorCompanyId_fkey" FOREIGN KEY ("investorCompanyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fundraiser" ADD CONSTRAINT "Fundraiser_raisingFundsId_fkey" FOREIGN KEY ("raisingFundsId") REFERENCES "RaisingFunds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentOffer" ADD CONSTRAINT "InvestmentOffer_investorCompanyId_fkey" FOREIGN KEY ("investorCompanyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentOffer" ADD CONSTRAINT "InvestmentOffer_raisingFundsId_fkey" FOREIGN KEY ("raisingFundsId") REFERENCES "RaisingFunds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundingRound" ADD CONSTRAINT "FundingRound_financialId_fkey" FOREIGN KEY ("financialId") REFERENCES "Financial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Financial" ADD CONSTRAINT "Financial_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginDevices" ADD CONSTRAINT "LoginDevices_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendlyIntegration" ADD CONSTRAINT "CalendlyIntegration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_id_fkey" FOREIGN KEY ("id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Founder" ADD CONSTRAINT "Founder_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyEmployees" ADD CONSTRAINT "KeyEmployees_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInformation" ADD CONSTRAINT "ProductInformation_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyFile" ADD CONSTRAINT "CompanyFile_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_raisingFundsId_fkey" FOREIGN KEY ("raisingFundsId") REFERENCES "RaisingFunds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerAccount" ADD CONSTRAINT "LedgerAccount_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_id_fkey" FOREIGN KEY ("id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorporateExperience" ADD CONSTRAINT "CorporateExperience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StartupExperience" ADD CONSTRAINT "StartupExperience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificationsCourses" ADD CONSTRAINT "CertificationsCourses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMedia" ADD CONSTRAINT "SocialMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFile" ADD CONSTRAINT "UserFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
