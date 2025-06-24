/*
  Warnings:

  - You are about to drop the `sutdent_details` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "sutdent_details";

-- CreateTable
CREATE TABLE "student_details" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "github_link" TEXT,
    "hashnode_link" TEXT,
    "peerlist_link" TEXT,
    "tweeter_link" TEXT,

    CONSTRAINT "student_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_details_email_key" ON "student_details"("email");
