/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Company_Profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Company_Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Company_Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Company_Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Company_Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company_Profile" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Company_Profile_username_key" ON "Company_Profile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Company_Profile_email_key" ON "Company_Profile"("email");
