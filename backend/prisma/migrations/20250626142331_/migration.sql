/*
  Warnings:

  - Added the required column `cohort_name` to the `student_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "student_details" ADD COLUMN     "cohort_name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "student_group_mapping_details" (
    "id" TEXT NOT NULL,
    "group_Id" TEXT NOT NULL,
    "student_Id" TEXT NOT NULL,
    "joining_date" TIMESTAMP(3),
    "leaving_date" TIMESTAMP(3),
    "removed_reason" TIMESTAMP(3),
    "removed_date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_group_mapping_details_pkey" PRIMARY KEY ("id")
);
