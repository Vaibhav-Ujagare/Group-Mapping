/*
  Warnings:

  - A unique constraint covering the columns `[student_Id,group_Id]` on the table `group_joining_request_details` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[student_Id,cohort_Id]` on the table `student_cohort_mapping_details` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[student_Id,group_Id]` on the table `student_group_mapping_details` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "group_joining_request_details_student_Id_group_Id_key" ON "group_joining_request_details"("student_Id", "group_Id");

-- CreateIndex
CREATE UNIQUE INDEX "student_cohort_mapping_details_student_Id_cohort_Id_key" ON "student_cohort_mapping_details"("student_Id", "cohort_Id");

-- CreateIndex
CREATE UNIQUE INDEX "student_group_mapping_details_student_Id_group_Id_key" ON "student_group_mapping_details"("student_Id", "group_Id");
