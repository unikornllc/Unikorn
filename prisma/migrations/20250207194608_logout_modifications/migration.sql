/*
  Warnings:

  - You are about to drop the column `profileId` on the `TokenBlacklist` table. All the data in the column will be lost.
  - Added the required column `browser` to the `RefreshTokenValid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ip` to the `RefreshTokenValid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `os` to the `RefreshTokenValid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RefreshTokenValid" ADD COLUMN     "browser" TEXT NOT NULL,
ADD COLUMN     "ip" TEXT NOT NULL,
ADD COLUMN     "os" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TokenBlacklist" DROP COLUMN "profileId";
