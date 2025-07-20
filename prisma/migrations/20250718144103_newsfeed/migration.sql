-- CreateTable
CREATE TABLE "user_newsfeed" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "priority" DECIMAL(10,4) NOT NULL,
    "insertedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seenAt" TIMESTAMP(3),
    "feedTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isNew" BOOLEAN NOT NULL DEFAULT true,
    "cursorKey" TEXT,

    CONSTRAINT "user_newsfeed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedSession" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastCursor" TEXT,
    "minSeenPriority" DECIMAL(10,4),

    CONSTRAINT "FeedSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_newsfeed_accountId_priority_feedTimestamp_id_idx" ON "user_newsfeed"("accountId", "priority" DESC, "feedTimestamp" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "user_newsfeed_accountId_cursorKey_idx" ON "user_newsfeed"("accountId", "cursorKey" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "user_newsfeed_accountId_postId_key" ON "user_newsfeed"("accountId", "postId");

CREATE INDEX "idx_account_priority_new" ON "user_newsfeed"("accountId", "priority" DESC) WHERE "isNew" = true;

-- AddForeignKey
ALTER TABLE "user_newsfeed" ADD CONSTRAINT "user_newsfeed_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_newsfeed" ADD CONSTRAINT "user_newsfeed_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
