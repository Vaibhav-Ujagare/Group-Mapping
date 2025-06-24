/*
  Warnings:

  - Added the required column `super_adminId` to the `cohort_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cohort_details" ADD COLUMN     "super_adminId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "cohort_details" ADD CONSTRAINT "cohort_details_super_adminId_fkey" FOREIGN KEY ("super_adminId") REFERENCES "super_admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
