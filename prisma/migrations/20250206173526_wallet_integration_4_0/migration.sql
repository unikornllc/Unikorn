/*
  Warnings:

  - You are about to drop the `userTransactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "userTransactions" DROP CONSTRAINT "userTransactions_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "userTransactions" DROP CONSTRAINT "userTransactions_senderId_fkey";

-- DropTable
DROP TABLE "userTransactions";
