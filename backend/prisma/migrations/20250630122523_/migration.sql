/*
  Warnings:

  - You are about to drop the `group_details_audit` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditAction" ADD VALUE 'REMOVED';
ALTER TYPE "AuditAction" ADD VALUE 'JOINED';
ALTER TYPE "AuditAction" ADD VALUE 'LEFT';

-- DropForeignKey
ALTER TABLE "group_details_audit" DROP CONSTRAINT "group_details_audit_groupId_fkey";

-- DropForeignKey
ALTER TABLE "group_details_audit" DROP CONSTRAINT "group_details_audit_studentId_fkey";

-- DropForeignKey
ALTER TABLE "group_joining_request_details" DROP CONSTRAINT "group_joining_request_details_groupId_fkey";

-- DropForeignKey
ALTER TABLE "group_joining_request_details" DROP CONSTRAINT "group_joining_request_details_studentId_fkey";

-- DropTable
DROP TABLE "group_details_audit";

-- DropEnum
DROP TYPE "GroupAuditAction";

-- CreateTable
CREATE TABLE "group_audit_log" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remarks" TEXT,
    "actionType" "AuditAction" NOT NULL,

    CONSTRAINT "group_audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_audit_log" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remarks" TEXT,
    "actionType" "AuditAction" NOT NULL,

    CONSTRAINT "user_audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "group_audit_log_groupId_studentId_key" ON "group_audit_log"("groupId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "user_audit_log_studentId_groupId_key" ON "user_audit_log"("studentId", "groupId");

-- AddForeignKey
ALTER TABLE "group_joining_request_details" ADD CONSTRAINT "group_joining_request_details_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_joining_request_details" ADD CONSTRAINT "group_joining_request_details_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_audit_log" ADD CONSTRAINT "group_audit_log_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_audit_log" ADD CONSTRAINT "group_audit_log_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_audit_log" ADD CONSTRAINT "user_audit_log_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_audit_log" ADD CONSTRAINT "user_audit_log_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;
