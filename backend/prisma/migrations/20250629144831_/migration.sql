-- CreateEnum
CREATE TYPE "GroupAuditAction" AS ENUM ('CREATED', 'UPDATED', 'REMOVED', 'JOINED', 'LEFT');

-- CreateTable
CREATE TABLE "group_details_audit" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remarks" TEXT,
    "actionType" "GroupAuditAction" NOT NULL,

    CONSTRAINT "group_details_audit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "group_details_audit" ADD CONSTRAINT "group_details_audit_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_details_audit" ADD CONSTRAINT "group_details_audit_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
