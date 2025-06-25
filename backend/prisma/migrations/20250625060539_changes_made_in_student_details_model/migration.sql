/*
  Warnings:

  - Added the required column `updatedAt` to the `student_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "student_details" ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
