-- CreateTable
CREATE TABLE "cohort_details" (
    "id" TEXT NOT NULL,
    "cohort_name" TEXT NOT NULL,
    "cohort_desc" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cohort_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cohort_details_cohort_name_key" ON "cohort_details"("cohort_name");
