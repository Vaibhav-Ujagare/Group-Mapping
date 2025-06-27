-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('REQUESTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWAL');

-- CreateTable
CREATE TABLE "group_joining_request_details" (
    "id" TEXT NOT NULL,
    "student_Id" TEXT NOT NULL,
    "group_Id" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL,
    "request_note_by_student" TEXT NOT NULL,
    "rejection_remark" TEXT NOT NULL,
    "requestd_on" TIMESTAMP(3) NOT NULL,
    "responded_on" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_joining_request_details_pkey" PRIMARY KEY ("id")
);
