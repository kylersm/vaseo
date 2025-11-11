-- CreateEnum
CREATE TYPE "Category" AS ENUM ('People', 'Process', 'Technology');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('Low', 'Medium', 'High');

-- CreateEnum
CREATE TYPE "Impact" AS ENUM ('Low', 'Medium', 'High');

-- CreateEnum
CREATE TYPE "Likelihood" AS ENUM ('Low', 'Medium', 'High');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Open', 'Closed');

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "currentCosts" INTEGER NOT NULL,
    "projectedCosts" INTEGER NOT NULL,
    "submissionDate" TIMESTAMP(3) NOT NULL,
    "deadlineDate" TIMESTAMP(3) NOT NULL,
    "category" "Category" NOT NULL,
    "severity" "Severity" NOT NULL,
    "description" TEXT NOT NULL,
    "contractAmount" INTEGER NOT NULL,
    "totalPaid" INTEGER NOT NULL,
    "owner" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Issue" (
    "id" SERIAL NOT NULL,
    "reportId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "impact" "Impact" NOT NULL,
    "likelihood" "Likelihood" NOT NULL,
    "startdate" TIMESTAMP(3) NOT NULL,
    "recommendation" TEXT NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
