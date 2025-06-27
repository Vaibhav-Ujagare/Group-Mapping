-- AlterTable
ALTER TABLE "group_joining_request_details" ALTER COLUMN "rejection_remark" DROP NOT NULL,
ALTER COLUMN "requestd_on" DROP NOT NULL,
ALTER COLUMN "responded_on" DROP NOT NULL;
