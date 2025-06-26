-- CreateTable
CREATE TABLE "student_cohort_mapping_details" (
    "id" TEXT NOT NULL,
    "student_Id" TEXT NOT NULL,
    "cohort_Id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_cohort_mapping_details_pkey" PRIMARY KEY ("id")
);
