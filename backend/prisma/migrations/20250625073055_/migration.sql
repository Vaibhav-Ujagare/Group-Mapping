-- DropForeignKey
ALTER TABLE "cohort_details" DROP CONSTRAINT "cohort_details_super_adminId_fkey";

-- AlterTable
ALTER TABLE "student_details" ADD COLUMN     "isGroupJoined" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "group_details" (
    "id" TEXT NOT NULL,
    "group_name" TEXT NOT NULL,
    "group_desc" TEXT NOT NULL,
    "student_Id" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notice_board_details" (
    "id" TEXT NOT NULL,
    "board_text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "student_Id" TEXT NOT NULL,
    "group_Id" TEXT NOT NULL,

    CONSTRAINT "notice_board_details_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cohort_details" ADD CONSTRAINT "cohort_details_super_adminId_fkey" FOREIGN KEY ("super_adminId") REFERENCES "super_admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_details" ADD CONSTRAINT "group_details_student_Id_fkey" FOREIGN KEY ("student_Id") REFERENCES "student_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notice_board_details" ADD CONSTRAINT "notice_board_details_student_Id_fkey" FOREIGN KEY ("student_Id") REFERENCES "student_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notice_board_details" ADD CONSTRAINT "notice_board_details_group_Id_fkey" FOREIGN KEY ("group_Id") REFERENCES "group_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;
