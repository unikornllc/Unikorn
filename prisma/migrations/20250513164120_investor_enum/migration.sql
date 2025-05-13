/*
  Warnings:

  - The `industry` column on the `Company` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CompanyPersonnel" ADD VALUE 'Employee';
ALTER TYPE "CompanyPersonnel" ADD VALUE 'Investor';
ALTER TYPE "CompanyPersonnel" ADD VALUE 'LeadInvestor';

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "socialMedia" JSONB,
DROP COLUMN "industry",
ADD COLUMN     "industry" TEXT[];
