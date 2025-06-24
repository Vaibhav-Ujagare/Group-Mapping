-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('LEADER', 'MEMBER');

-- CreateTable
CREATE TABLE "sutdent_details" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "github_link" TEXT,
    "hashnode_link" TEXT,
    "peerlist_link" TEXT,
    "tweeter_link" TEXT,

    CONSTRAINT "sutdent_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sutdent_details_email_key" ON "sutdent_details"("email");
