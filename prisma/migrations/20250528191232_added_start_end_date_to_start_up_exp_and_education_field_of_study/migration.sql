-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "fieldofStudy" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "StartupExperience" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3);
