/*
  Warnings:

  - You are about to drop the column `student_Id` on the `group_details` table. All the data in the column will be lost.
  - You are about to drop the column `group_Id` on the `group_joining_request_details` table. All the data in the column will be lost.
  - You are about to drop the column `requestd_on` on the `group_joining_request_details` table. All the data in the column will be lost.
  - You are about to drop the column `student_Id` on the `group_joining_request_details` table. All the data in the column will be lost.
  - You are about to drop the column `cohort_Id` on the `student_cohort_mapping_details` table. All the data in the column will be lost.
  - You are about to drop the column `student_Id` on the `student_cohort_mapping_details` table. All the data in the column will be lost.
  - You are about to drop the column `isEmailVerified` on the `student_details` table. All the data in the column will be lost.
  - You are about to drop the column `group_Id` on the `student_group_mapping_details` table. All the data in the column will be lost.
  - You are about to drop the column `student_Id` on the `student_group_mapping_details` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,groupId]` on the table `group_joining_request_details` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId,cohortId]` on the table `student_cohort_mapping_details` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId,groupId]` on the table `student_group_mapping_details` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdById` to the `group_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `group_joining_request_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `group_joining_request_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cohortId` to the `student_cohort_mapping_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `student_cohort_mapping_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `student_group_mapping_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `student_group_mapping_details` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "group_details" DROP CONSTRAINT "group_details_student_Id_fkey";

-- DropIndex
DROP INDEX "group_joining_request_details_student_Id_group_Id_key";

-- DropIndex
DROP INDEX "student_cohort_mapping_details_student_Id_cohort_Id_key";

-- DropIndex
DROP INDEX "student_group_mapping_details_student_Id_group_Id_key";

-- AlterTable
ALTER TABLE "group_details" DROP COLUMN "student_Id",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "group_joining_request_details" DROP COLUMN "group_Id",
DROP COLUMN "requestd_on",
DROP COLUMN "student_Id",
ADD COLUMN     "groupId" TEXT NOT NULL,
ADD COLUMN     "requested_on" TIMESTAMP(3),
ADD COLUMN     "studentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "student_cohort_mapping_details" DROP COLUMN "cohort_Id",
DROP COLUMN "student_Id",
ADD COLUMN     "cohortId" TEXT NOT NULL,
ADD COLUMN     "studentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "student_details" DROP COLUMN "isEmailVerified";

-- AlterTable
ALTER TABLE "student_group_mapping_details" DROP COLUMN "group_Id",
DROP COLUMN "student_Id",
ADD COLUMN     "groupId" TEXT NOT NULL,
ADD COLUMN     "studentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "group_joining_request_details_studentId_groupId_key" ON "group_joining_request_details"("studentId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "student_cohort_mapping_details_studentId_cohortId_key" ON "student_cohort_mapping_details"("studentId", "cohortId");

-- CreateIndex
CREATE UNIQUE INDEX "student_group_mapping_details_studentId_groupId_key" ON "student_group_mapping_details"("studentId", "groupId");

-- AddForeignKey
ALTER TABLE "group_details" ADD CONSTRAINT "group_details_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "student_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_group_mapping_details" ADD CONSTRAINT "student_group_mapping_details_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_group_mapping_details" ADD CONSTRAINT "student_group_mapping_details_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_cohort_mapping_details" ADD CONSTRAINT "student_cohort_mapping_details_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_cohort_mapping_details" ADD CONSTRAINT "student_cohort_mapping_details_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "cohort_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_joining_request_details" ADD CONSTRAINT "group_joining_request_details_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_joining_request_details" ADD CONSTRAINT "group_joining_request_details_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
