/*
  Warnings:

  - Added the required column `emailVerify` to the `Company_Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verified` to the `Company_Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company_Profile" ADD COLUMN     "emailVerify" BOOLEAN NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL;
