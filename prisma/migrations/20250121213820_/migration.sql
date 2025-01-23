/*
  Warnings:

  - You are about to drop the column `linkedId` on the `LoginDevices` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LoginDevices" DROP CONSTRAINT "FK_Company_Profile_LoginDevices";

-- DropForeignKey
ALTER TABLE "LoginDevices" DROP CONSTRAINT "FK_User_LoginDevices";

-- AlterTable
ALTER TABLE "LoginDevices" DROP COLUMN "linkedId",
ADD COLUMN     "companyId" TEXT,
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "LoginDevices" ADD CONSTRAINT "LoginDevices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginDevices" ADD CONSTRAINT "LoginDevices_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company_Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
