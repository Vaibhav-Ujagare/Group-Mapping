/*
  Warnings:

  - You are about to drop the column `group_Id` on the `notice_board_details` table. All the data in the column will be lost.
  - You are about to drop the column `student_Id` on the `notice_board_details` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerificationExpiry` on the `student_details` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerificationToken` on the `student_details` table. All the data in the column will be lost.
  - Added the required column `groupId` to the `notice_board_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `notice_board_details` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATED', 'UPDATED', 'DELETED');

-- DropForeignKey
ALTER TABLE "notice_board_details" DROP CONSTRAINT "notice_board_details_group_Id_fkey";

-- DropForeignKey
ALTER TABLE "notice_board_details" DROP CONSTRAINT "notice_board_details_student_Id_fkey";

-- AlterTable
ALTER TABLE "notice_board_details" DROP COLUMN "group_Id",
DROP COLUMN "student_Id",
ADD COLUMN     "groupId" TEXT NOT NULL,
ADD COLUMN     "studentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "student_details" DROP COLUMN "emailVerificationExpiry",
DROP COLUMN "emailVerificationToken";

-- CreateTable
CREATE TABLE "notice_board_audit_log" (
    "id" TEXT NOT NULL,
    "noticeBoardId" TEXT NOT NULL,
    "actionType" "AuditAction" NOT NULL,
    "previousText" TEXT,
    "newText" TEXT,
    "performedById" TEXT NOT NULL,
    "performedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notice_board_audit_log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notice_board_details" ADD CONSTRAINT "notice_board_details_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notice_board_details" ADD CONSTRAINT "notice_board_details_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notice_board_audit_log" ADD CONSTRAINT "notice_board_audit_log_noticeBoardId_fkey" FOREIGN KEY ("noticeBoardId") REFERENCES "notice_board_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notice_board_audit_log" ADD CONSTRAINT "notice_board_audit_log_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "student_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;
