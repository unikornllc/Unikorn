/*
  Warnings:

  - The values [Startup,VC] on the enum `CompanyType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CompanyType_new" AS ENUM ('Profit', 'NonProfit', 'Private', 'Public');
ALTER TABLE "Company" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Company" ALTER COLUMN "type" TYPE "CompanyType_new" USING ("type"::text::"CompanyType_new");
ALTER TYPE "CompanyType" RENAME TO "CompanyType_old";
ALTER TYPE "CompanyType_new" RENAME TO "CompanyType";
DROP TYPE "CompanyType_old";
ALTER TABLE "Company" ALTER COLUMN "type" SET DEFAULT 'Public';
COMMIT;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "isInvestor" BOOLEAN NOT NULL DEFAULT false;
