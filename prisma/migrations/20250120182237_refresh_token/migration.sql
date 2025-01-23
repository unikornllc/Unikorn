-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Company');

-- CreateTable
CREATE TABLE "RefreshTokenValid" (
    "sid" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL,
    "ip" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "browser" TEXT NOT NULL,

    CONSTRAINT "RefreshTokenValid_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "TokenBlacklist" (
    "token" TEXT NOT NULL,

    CONSTRAINT "TokenBlacklist_pkey" PRIMARY KEY ("token")
);
