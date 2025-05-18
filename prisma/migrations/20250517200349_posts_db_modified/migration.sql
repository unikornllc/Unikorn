/*
  Warnings:

  - The values [MEDIA,TEXT] on the enum `PostType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `pollId` on the `Post` table. All the data in the column will be lost.
  - You are about to alter the column `content` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(3000)`.
  - You are about to drop the `_PollToPollVote` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[postId]` on the table `Poll` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `postId` to the `Poll` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pollId` to the `PollVote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PostType_new" AS ENUM ('LOOKING_FOR_FUNDING', 'LOOKING_FOR_PARTNER', 'LOOKING_FOR_GUIDANCE', 'EVENT', 'POLL', 'DOCUMENT');
ALTER TABLE "Post" ALTER COLUMN "type" TYPE "PostType_new" USING ("type"::text::"PostType_new");
ALTER TYPE "PostType" RENAME TO "PostType_old";
ALTER TYPE "PostType_new" RENAME TO "PostType";
DROP TYPE "PostType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_pollId_fkey";

-- DropForeignKey
ALTER TABLE "_PollToPollVote" DROP CONSTRAINT "_PollToPollVote_A_fkey";

-- DropForeignKey
ALTER TABLE "_PollToPollVote" DROP CONSTRAINT "_PollToPollVote_B_fkey";

-- DropIndex
DROP INDEX "Post_pollId_key";

-- AlterTable
ALTER TABLE "Poll" ADD COLUMN     "postId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PollVote" ADD COLUMN     "pollId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "pollId",
ADD COLUMN     "roundId" TEXT,
ALTER COLUMN "content" SET DATA TYPE VARCHAR(3000);

-- DropTable
DROP TABLE "_PollToPollVote";

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" VARCHAR(3000) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "location" TEXT,
    "virtualLink" TEXT,
    "isVirtual" BOOLEAN NOT NULL DEFAULT false,
    "postId" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_postId_key" ON "Event"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "Document_postId_key" ON "Document"("postId");

-- CreateIndex
CREATE INDEX "Account_id_idx" ON "Account"("id");

-- CreateIndex
CREATE INDEX "Account_username_idx" ON "Account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Poll_postId_key" ON "Poll"("postId");

-- CreateIndex
CREATE INDEX "Poll_id_idx" ON "Poll"("id");

-- CreateIndex
CREATE INDEX "PollOption_id_idx" ON "PollOption"("id");

-- CreateIndex
CREATE INDEX "PollVote_accountId_pollId_idx" ON "PollVote"("accountId", "pollId");

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");

-- CreateIndex
CREATE INDEX "Post_id_idx" ON "Post"("id");

-- CreateIndex
CREATE INDEX "Post_type_createdAt_idx" ON "Post"("type", "createdAt");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "FundingRound"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poll" ADD CONSTRAINT "Poll_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollVote" ADD CONSTRAINT "PollVote_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
