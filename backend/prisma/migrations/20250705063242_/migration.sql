/*
  Warnings:

  - You are about to drop the column `username` on the `super_admin` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `super_admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `super_admin` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "super_admin_username_key";

-- AlterTable
ALTER TABLE "super_admin" DROP COLUMN "username",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "super_admin_email_key" ON "super_admin"("email");
