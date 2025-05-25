-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_roundId_fkey";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "RaisingFunds"("id") ON DELETE SET NULL ON UPDATE CASCADE;
