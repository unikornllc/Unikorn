-- CreateTable
CREATE TABLE "Raising_Funds" (
    "id" TEXT NOT NULL,
    "equityPercentage" DOUBLE PRECISION NOT NULL,
    "fundingAmount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Raising_Funds_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Raising_Funds" ADD CONSTRAINT "Raising_Funds_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company_Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
