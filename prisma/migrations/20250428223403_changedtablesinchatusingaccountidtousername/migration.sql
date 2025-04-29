/*
  Warnings:

  - The values [BoardMemeber] on the enum `CompanyPersonnel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CompanyPersonnel_new" AS ENUM ('Founder', 'Advisor', 'BoardMember', 'KeyEmployee');
ALTER TABLE "Personnel" ALTER COLUMN "role" TYPE "CompanyPersonnel_new" USING ("role"::text::"CompanyPersonnel_new");
ALTER TYPE "CompanyPersonnel" RENAME TO "CompanyPersonnel_old";
ALTER TYPE "CompanyPersonnel_new" RENAME TO "CompanyPersonnel";
DROP TYPE "CompanyPersonnel_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "BlockedUser" DROP CONSTRAINT "BlockedUser_blockedId_fkey";

-- DropForeignKey
ALTER TABLE "BlockedUser" DROP CONSTRAINT "BlockedUser_blockerId_fkey";

-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_senderId_fkey";

-- DropForeignKey
ALTER TABLE "ReportedUser" DROP CONSTRAINT "ReportedUser_reportedId_fkey";

-- DropForeignKey
ALTER TABLE "ReportedUser" DROP CONSTRAINT "ReportedUser_reporterId_fkey";

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Account"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Account"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedUser" ADD CONSTRAINT "BlockedUser_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "Account"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedUser" ADD CONSTRAINT "BlockedUser_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "Account"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportedUser" ADD CONSTRAINT "ReportedUser_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "Account"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportedUser" ADD CONSTRAINT "ReportedUser_reportedId_fkey" FOREIGN KEY ("reportedId") REFERENCES "Account"("username") ON DELETE CASCADE ON UPDATE CASCADE;
