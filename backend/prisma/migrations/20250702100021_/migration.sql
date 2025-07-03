/*
  Warnings:

  - You are about to drop the `group_audit_log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_audit_log` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "group_audit_log" DROP CONSTRAINT "group_audit_log_groupId_fkey";

-- DropForeignKey
ALTER TABLE "group_audit_log" DROP CONSTRAINT "group_audit_log_studentId_fkey";

-- DropForeignKey
ALTER TABLE "user_audit_log" DROP CONSTRAINT "user_audit_log_groupId_fkey";

-- DropForeignKey
ALTER TABLE "user_audit_log" DROP CONSTRAINT "user_audit_log_studentId_fkey";

-- DropTable
DROP TABLE "group_audit_log";

-- DropTable
DROP TABLE "user_audit_log";

-- CreateTable
CREATE TABLE "group_user_audit_log" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remarks" TEXT,
    "actionType" "AuditAction" NOT NULL,

    CONSTRAINT "group_user_audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "group_user_audit_log_groupId_studentId_key" ON "group_user_audit_log"("groupId", "studentId");

-- AddForeignKey
ALTER TABLE "group_user_audit_log" ADD CONSTRAINT "group_user_audit_log_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_user_audit_log" ADD CONSTRAINT "group_user_audit_log_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;
