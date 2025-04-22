-- CreateEnum
CREATE TYPE "InvestorType" AS ENUM ('User', 'Company');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('Pending', 'Accepted', 'Rejected');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('Pending', 'Active', 'Completed', 'Failed');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('User', 'Company');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Company');

-- CreateEnum
CREATE TYPE "VisibilityOption" AS ENUM ('PUBLIC', 'PRO_USERS', 'INVESTORS', 'ENTREPRENEURS', 'CUSTOM');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('INVESTOR', 'ENTREPRENEUR', 'USER');

-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('IMAGE', 'FILE', 'EMOJI');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('Profit', 'NonProfit', 'Private', 'Public');

-- CreateEnum
CREATE TYPE "CompanyTier" AS ENUM ('Hunter', 'Holder');

-- CreateEnum
CREATE TYPE "CompanyPersonnel" AS ENUM ('Founder', 'Advisor', 'BoardMemeber', 'KeyEmployee');

-- CreateEnum
CREATE TYPE "EntryType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "FlowType" AS ENUM ('Wallet_Deposit', 'Wallet_Withdraw', 'Investment_Flow');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('Wallet_Deposit', 'Wallet_Withdraw', 'Surrender_Equity', 'Purchase_Equity', 'Withdraw_Equity');

-- CreateEnum
CREATE TYPE "Title" AS ENUM ('Mr', 'Mrs', 'Ms');

-- CreateEnum
CREATE TYPE "Degree" AS ENUM ('NONE', 'BA', 'BSc', 'MA', 'MSc', 'MBA', 'PhD');

-- CreateEnum
CREATE TYPE "LanguageProficiency" AS ENUM ('Beginner', 'Intermediate', 'Proficient');

-- CreateEnum
CREATE TYPE "SocialMediaPlatforms" AS ENUM ('LinkedIn', 'X', 'Meetup');

-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('Pro', 'Standard');

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
CREATE TABLE "Fundraiser" (
    "id" TEXT NOT NULL,
    "investorType" "InvestorType" NOT NULL,
    "investorUserId" TEXT,
    "investorCompanyId" TEXT,
    "raisingFundsId" TEXT NOT NULL,
    "equityPercentage" DOUBLE PRECISION NOT NULL,
    "fundingAmount" DOUBLE PRECISION NOT NULL,
    "portions" INTEGER NOT NULL,
    "pricePerPortion" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'Pending',
    "envelopeId" TEXT NOT NULL,

    CONSTRAINT "Fundraiser_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "Financial" (
    "id" TEXT NOT NULL,
    "valuation" DOUBLE PRECISION NOT NULL,
    "investors" TEXT[],
    "totalFundingAmount" DOUBLE PRECISION NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Financial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "mobileNumber" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" "AccountType" NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshTokenValid" (
    "sid" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "RefreshTokenValid_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "TokenBlacklist" (
    "token" TEXT NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenBlacklist_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "LoginDevices" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "LoginDevices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlacklistedPasswordToken" (
    "id" SERIAL NOT NULL,
    "jti" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlacklistedPasswordToken_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "isGroupChat" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatParticipant" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isFavorited" BOOLEAN NOT NULL DEFAULT false,
    "isMuted" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "lastReadMessageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT,
    "isRequestMessage" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "type" "AttachmentType" NOT NULL,
    "url" TEXT NOT NULL,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadReceipt" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FriendRequest" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedUser" (
    "id" TEXT NOT NULL,
    "blockerId" TEXT NOT NULL,
    "blockedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlockedUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportedUser" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reportedId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportedUser_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Personnel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "CompanyPersonnel" NOT NULL,
    "crunchBaseLink" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Personnel_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "followerId" TEXT,
    "followingId" TEXT,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "onHold" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Journal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "flowType" "FlowType" NOT NULL,
    "raisingFundsId" TEXT,

    CONSTRAINT "Journal_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "LedgerAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "totalBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "LedgerAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" VARCHAR(601) NOT NULL,
    "title" "Title" NOT NULL DEFAULT 'Mr',
    "tier" "Tier" NOT NULL DEFAULT 'Standard',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expertise" (
    "id" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Expertise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "degree" "Degree" NOT NULL DEFAULT 'NONE',
    "institution" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorporateExperience" (
    "id" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
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
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "proficiency" "LanguageProficiency" NOT NULL DEFAULT 'Beginner',
    "userId" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Fundraiser_raisingFundsId_investorUserId_investorCompanyId_key" ON "Fundraiser"("raisingFundsId", "investorUserId", "investorCompanyId");

-- CreateIndex
CREATE UNIQUE INDEX "Financial_companyId_key" ON "Financial"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_id_key" ON "Account"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Account_username_key" ON "Account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_mobileNumber_key" ON "Account"("mobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "LoginDevices_ip_browser_os_accountId_key" ON "LoginDevices"("ip", "browser", "os", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "BlacklistedPasswordToken_jti_key" ON "BlacklistedPasswordToken"("jti");

-- CreateIndex
CREATE UNIQUE INDEX "CalendlyIntegration_userId_key" ON "CalendlyIntegration"("userId");

-- CreateIndex
CREATE INDEX "ChatParticipant_chatId_idx" ON "ChatParticipant"("chatId");

-- CreateIndex
CREATE INDEX "ChatParticipant_username_idx" ON "ChatParticipant"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ChatParticipant_username_chatId_key" ON "ChatParticipant"("username", "chatId");

-- CreateIndex
CREATE INDEX "Message_chatId_createdAt_idx" ON "Message"("chatId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Attachment_messageId_idx" ON "Attachment"("messageId");

-- CreateIndex
CREATE INDEX "ReadReceipt_username_idx" ON "ReadReceipt"("username");

-- CreateIndex
CREATE INDEX "ReadReceipt_messageId_idx" ON "ReadReceipt"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "ReadReceipt_messageId_username_key" ON "ReadReceipt"("messageId", "username");

-- CreateIndex
CREATE INDEX "FriendRequest_receiverId_status_idx" ON "FriendRequest"("receiverId", "status");

-- CreateIndex
CREATE INDEX "FriendRequest_senderId_status_idx" ON "FriendRequest"("senderId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_senderId_receiverId_key" ON "FriendRequest"("senderId", "receiverId");

-- CreateIndex
CREATE INDEX "BlockedUser_blockerId_idx" ON "BlockedUser"("blockerId");

-- CreateIndex
CREATE INDEX "BlockedUser_blockedId_idx" ON "BlockedUser"("blockedId");

-- CreateIndex
CREATE UNIQUE INDEX "BlockedUser_blockerId_blockedId_key" ON "BlockedUser"("blockerId", "blockedId");

-- CreateIndex
CREATE INDEX "ReportedUser_reporterId_idx" ON "ReportedUser"("reporterId");

-- CreateIndex
CREATE INDEX "ReportedUser_reportedId_idx" ON "ReportedUser"("reportedId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_id_key" ON "Company"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyFile_fileName_companyId_key" ON "CompanyFile"("fileName", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_accountId_key" ON "Wallet"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Journal_name_key" ON "Journal"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Journal_raisingFundsId_key" ON "Journal"("raisingFundsId");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerAccount_accountId_key" ON "LedgerAccount"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserFile_fileName_userId_key" ON "UserFile"("fileName", "userId");

-- AddForeignKey
ALTER TABLE "RaisingFunds" ADD CONSTRAINT "RaisingFunds_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fundraiser" ADD CONSTRAINT "Fundraiser_investorUserId_fkey" FOREIGN KEY ("investorUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fundraiser" ADD CONSTRAINT "Fundraiser_investorCompanyId_fkey" FOREIGN KEY ("investorCompanyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fundraiser" ADD CONSTRAINT "Fundraiser_raisingFundsId_fkey" FOREIGN KEY ("raisingFundsId") REFERENCES "RaisingFunds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentOffer" ADD CONSTRAINT "InvestmentOffer_investorUserId_fkey" FOREIGN KEY ("investorUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "ChatParticipant" ADD CONSTRAINT "ChatParticipant_username_fkey" FOREIGN KEY ("username") REFERENCES "Account"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatParticipant" ADD CONSTRAINT "ChatParticipant_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatParticipant" ADD CONSTRAINT "ChatParticipant_lastReadMessageId_fkey" FOREIGN KEY ("lastReadMessageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadReceipt" ADD CONSTRAINT "ReadReceipt_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadReceipt" ADD CONSTRAINT "ReadReceipt_username_fkey" FOREIGN KEY ("username") REFERENCES "Account"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedUser" ADD CONSTRAINT "BlockedUser_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedUser" ADD CONSTRAINT "BlockedUser_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportedUser" ADD CONSTRAINT "ReportedUser_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportedUser" ADD CONSTRAINT "ReportedUser_reportedId_fkey" FOREIGN KEY ("reportedId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_id_fkey" FOREIGN KEY ("id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personnel" ADD CONSTRAINT "Personnel_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personnel" ADD CONSTRAINT "Personnel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInformation" ADD CONSTRAINT "ProductInformation_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyFile" ADD CONSTRAINT "CompanyFile_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_raisingFundsId_fkey" FOREIGN KEY ("raisingFundsId") REFERENCES "RaisingFunds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "Journal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_ledgerId_fkey" FOREIGN KEY ("ledgerId") REFERENCES "LedgerAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerAccount" ADD CONSTRAINT "LedgerAccount_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_id_fkey" FOREIGN KEY ("id") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expertise" ADD CONSTRAINT "Expertise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorporateExperience" ADD CONSTRAINT "CorporateExperience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StartupExperience" ADD CONSTRAINT "StartupExperience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificationsCourses" ADD CONSTRAINT "CertificationsCourses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMedia" ADD CONSTRAINT "SocialMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFile" ADD CONSTRAINT "UserFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
