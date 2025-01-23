/*
  Warnings:

  - You are about to drop the column `browser` on the `RefreshTokenValid` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `RefreshTokenValid` table. All the data in the column will be lost.
  - You are about to drop the column `os` on the `RefreshTokenValid` table. All the data in the column will be lost.
  - Added the required column `expire` to the `TokenBlacklist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `TokenBlacklist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RefreshTokenValid" DROP COLUMN "browser",
DROP COLUMN "ip",
DROP COLUMN "os";

-- AlterTable
ALTER TABLE "TokenBlacklist" ADD COLUMN     "expire" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "profileId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "LoginDevices" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "linkedId" TEXT NOT NULL,

    CONSTRAINT "LoginDevices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LoginDevices" ADD CONSTRAINT "FK_User_LoginDevices" FOREIGN KEY ("linkedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginDevices" ADD CONSTRAINT "FK_Company_Profile_LoginDevices" FOREIGN KEY ("linkedId") REFERENCES "Company_Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
