-- CreateEnum
CREATE TYPE "Company_Type" AS ENUM ('Profit', 'NonProfit', 'Private', 'Public');

-- CreateTable
CREATE TABLE "Company_Profile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "website" TEXT NOT NULL,
    "founded" TIMESTAMP(3) NOT NULL,
    "type" "Company_Type" NOT NULL DEFAULT 'Public',
    "hqlocation" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "hunter" BOOLEAN NOT NULL DEFAULT false,
    "board_members" TEXT[],
    "advisors" TEXT[],

    CONSTRAINT "Company_Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Founder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "crunch_base_link" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Founder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Key_Employees" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Key_Employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Funding_Round" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "funding_amount" INTEGER NOT NULL,
    "round_date" TIMESTAMP(3) NOT NULL,
    "lead_investors" TEXT[],
    "financialId" TEXT NOT NULL,

    CONSTRAINT "Funding_Round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Financial" (
    "id" TEXT NOT NULL,
    "valuation" INTEGER NOT NULL,
    "investors" TEXT[],
    "total_funding_amount" INTEGER NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Financial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product_Information" (
    "id" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "partnerships" TEXT[],
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Product_Information_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "Entrepreneur" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Entrepreneur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investor" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Investor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Financial_companyId_key" ON "Financial"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_Information_companyId_key" ON "Product_Information"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_companyId_key" ON "Activity"("companyId");

-- AddForeignKey
ALTER TABLE "Founder" ADD CONSTRAINT "Founder_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company_Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Key_Employees" ADD CONSTRAINT "Key_Employees_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company_Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funding_Round" ADD CONSTRAINT "Funding_Round_financialId_fkey" FOREIGN KEY ("financialId") REFERENCES "Financial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Financial" ADD CONSTRAINT "Financial_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company_Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product_Information" ADD CONSTRAINT "Product_Information_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company_Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company_Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
