-- CreateEnum
CREATE TYPE "Title" AS ENUM ('Mr', 'Mrs', 'Ms');

-- CreateEnum
CREATE TYPE "Degree" AS ENUM ('NONE', 'BA', 'BSc', 'MA', 'MSc', 'MBA', 'PhD');

-- CreateEnum
CREATE TYPE "Language_Proficiency" AS ENUM ('Beginner', 'Intermediate', 'Proficient');

-- CreateEnum
CREATE TYPE "Social_Media_Platforms" AS ENUM ('LinkedIn', 'X', 'Meetup');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "title" "Title" NOT NULL DEFAULT 'Mr',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expertise" (
    "id" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Expertise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "degree" "Degree" NOT NULL DEFAULT 'NONE',
    "institution" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Corporate_Experience" (
    "id" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "responsibilities" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Corporate_Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Startup_Experience" (
    "id" TEXT NOT NULL,
    "startup_name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Startup_Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certifications_Courses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "completion_date" TIMESTAMP(3) NOT NULL,
    "focus_area" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Certifications_Courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "proficiency" "Language_Proficiency" NOT NULL DEFAULT 'Beginner',
    "userId" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Social_Media" (
    "id" TEXT NOT NULL,
    "platform" "Social_Media_Platforms" NOT NULL DEFAULT 'X',
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Social_Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Expertise" ADD CONSTRAINT "Expertise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Corporate_Experience" ADD CONSTRAINT "Corporate_Experience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Startup_Experience" ADD CONSTRAINT "Startup_Experience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certifications_Courses" ADD CONSTRAINT "Certifications_Courses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Social_Media" ADD CONSTRAINT "Social_Media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
