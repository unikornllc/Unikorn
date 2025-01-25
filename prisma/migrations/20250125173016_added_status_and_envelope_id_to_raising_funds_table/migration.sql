/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Raising_Funds` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Raising_Funds` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[envelopeId]` on the table `Raising_Funds` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `envelopeId` to the `Raising_Funds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Raising_Funds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Raising_Funds" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "envelopeId" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Raising_Funds_envelopeId_key" ON "Raising_Funds"("envelopeId");
