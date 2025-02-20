/*
  Warnings:

  - You are about to drop the `UserFollowsCompany` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserFollowsUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserFollowsCompany" DROP CONSTRAINT "UserFollowsCompany_companyId_fkey";

-- DropForeignKey
ALTER TABLE "UserFollowsCompany" DROP CONSTRAINT "UserFollowsCompany_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserFollowsUser" DROP CONSTRAINT "UserFollowsUser_followerId_fkey";

-- DropForeignKey
ALTER TABLE "UserFollowsUser" DROP CONSTRAINT "UserFollowsUser_followingId_fkey";

-- DropTable
DROP TABLE "UserFollowsCompany";

-- DropTable
DROP TABLE "UserFollowsUser";

-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FolloweruserId" TEXT,
    "FollowercompanyId" TEXT,
    "FollowinguserId" TEXT,
    "FollowingcompanyId" TEXT,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_FolloweruserId_fkey" FOREIGN KEY ("FolloweruserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_FollowercompanyId_fkey" FOREIGN KEY ("FollowercompanyId") REFERENCES "Company_Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_FollowinguserId_fkey" FOREIGN KEY ("FollowinguserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_FollowingcompanyId_fkey" FOREIGN KEY ("FollowingcompanyId") REFERENCES "Company_Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
