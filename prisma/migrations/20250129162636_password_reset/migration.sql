-- CreateTable
CREATE TABLE "BlacklistedPasswordToken" (
    "id" SERIAL NOT NULL,
    "jti" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlacklistedPasswordToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlacklistedPasswordToken_jti_key" ON "BlacklistedPasswordToken"("jti");
