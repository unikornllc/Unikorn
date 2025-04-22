/*
  Warnings:

  - You are about to drop the column `userId` on the `ChatParticipant` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ReadReceipt` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username,chatId]` on the table `ChatParticipant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[messageId,username]` on the table `ReadReceipt` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `ChatParticipant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `ReadReceipt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChatParticipant" DROP CONSTRAINT "ChatParticipant_userId_fkey";

-- DropForeignKey
ALTER TABLE "ReadReceipt" DROP CONSTRAINT "ReadReceipt_userId_fkey";

-- DropIndex
DROP INDEX "ChatParticipant_userId_chatId_key";

-- DropIndex
DROP INDEX "ChatParticipant_userId_idx";

-- DropIndex
DROP INDEX "ReadReceipt_messageId_userId_key";

-- DropIndex
DROP INDEX "ReadReceipt_userId_idx";

-- AlterTable
ALTER TABLE "ChatParticipant" DROP COLUMN "userId",
ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ReadReceipt" DROP COLUMN "userId",
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "ChatParticipant_username_idx" ON "ChatParticipant"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ChatParticipant_username_chatId_key" ON "ChatParticipant"("username", "chatId");

-- CreateIndex
CREATE INDEX "ReadReceipt_username_idx" ON "ReadReceipt"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ReadReceipt_messageId_username_key" ON "ReadReceipt"("messageId", "username");

-- AddForeignKey
ALTER TABLE "ChatParticipant" ADD CONSTRAINT "ChatParticipant_username_fkey" FOREIGN KEY ("username") REFERENCES "Account"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadReceipt" ADD CONSTRAINT "ReadReceipt_username_fkey" FOREIGN KEY ("username") REFERENCES "Account"("username") ON DELETE CASCADE ON UPDATE CASCADE;
