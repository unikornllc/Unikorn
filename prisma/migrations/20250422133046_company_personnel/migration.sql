/*
  Warnings:

  - You are about to drop the column `advisors` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `boardMembers` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the `Founder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KeyEmployees` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CompanyPersonnel" AS ENUM ('Founder', 'Advisor', 'BoardMemeber', 'KeyEmployee');

-- DropForeignKey
ALTER TABLE "Founder" DROP CONSTRAINT "Founder_companyId_fkey";

-- DropForeignKey
ALTER TABLE "KeyEmployees" DROP CONSTRAINT "KeyEmployees_companyId_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "advisors",
DROP COLUMN "boardMembers";

-- DropTable
DROP TABLE "Founder";

-- DropTable
DROP TABLE "KeyEmployees";

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

-- AddForeignKey
ALTER TABLE "Personnel" ADD CONSTRAINT "Personnel_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personnel" ADD CONSTRAINT "Personnel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
