-- CreateTable
CREATE TABLE "UserFollowsUser" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFollowsUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFollowsCompany" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFollowsCompany_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "follower_idx" ON "UserFollowsUser"("followerId");

-- CreateIndex
CREATE INDEX "following_idx" ON "UserFollowsUser"("followingId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFollowsUser_followerId_followingId_key" ON "UserFollowsUser"("followerId", "followingId");

-- CreateIndex
CREATE INDEX "user_idx" ON "UserFollowsCompany"("userId");

-- CreateIndex
CREATE INDEX "company_idx" ON "UserFollowsCompany"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFollowsCompany_userId_companyId_key" ON "UserFollowsCompany"("userId", "companyId");

-- AddForeignKey
ALTER TABLE "UserFollowsUser" ADD CONSTRAINT "UserFollowsUser_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollowsUser" ADD CONSTRAINT "UserFollowsUser_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollowsCompany" ADD CONSTRAINT "UserFollowsCompany_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollowsCompany" ADD CONSTRAINT "UserFollowsCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company_Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
