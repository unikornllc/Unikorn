-- CreateEnum
CREATE TYPE "VisibilityOption" AS ENUM ('PUBLIC', 'PRO_USERS', 'INVESTORS', 'ENTREPRENEURS', 'CUSTOM');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "calendlyVisibility" "VisibilityOption" NOT NULL DEFAULT 'PUBLIC';

-- CreateTable
CREATE TABLE "Calendly_Integration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "tokenType" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "scope" TEXT NOT NULL,
    "calendlyUserURI" TEXT NOT NULL,
    "calendlyOrgURI" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Calendly_Integration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Calendly_Integration_userId_key" ON "Calendly_Integration"("userId");

-- AddForeignKey
ALTER TABLE "Calendly_Integration" ADD CONSTRAINT "Calendly_Integration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
