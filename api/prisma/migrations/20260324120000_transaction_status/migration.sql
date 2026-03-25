-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('Processing', 'Success', 'Failure');

-- AlterTable: add status column with default
ALTER TABLE "Transaction" ADD COLUMN "status" "TransactionStatus" NOT NULL DEFAULT 'Success';

-- Migrate existing data: set status based on current type
UPDATE "Transaction" SET "status" = 'Processing' WHERE "type" = 'PayoutInitiated';
UPDATE "Transaction" SET "status" = 'Failure' WHERE "type" = 'PayoutReversed';

-- Migrate TransactionType values: collapse payout variants into 'Payout'
-- and rename 'RevenueRealization' to 'Revenue'

-- Step 1: Add new enum values
ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'Revenue';
ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'Payout';

-- Step 2: Update rows to use new values
UPDATE "Transaction" SET "type" = 'Revenue' WHERE "type" = 'RevenueRealization';
UPDATE "Transaction" SET "type" = 'Payout' WHERE "type" IN ('PayoutInitiated', 'PayoutCompleted', 'PayoutReversed');

-- Step 3: Recreate enum without old values
-- PostgreSQL doesn't support DROP VALUE from enums, so we recreate
ALTER TYPE "TransactionType" RENAME TO "TransactionType_old";
CREATE TYPE "TransactionType" AS ENUM ('Revenue', 'Payout', 'SubscriptionFee', 'Adjustment', 'Refund');
ALTER TABLE "Transaction" ALTER COLUMN "type" TYPE "TransactionType" USING "type"::text::"TransactionType";
DROP TYPE "TransactionType_old";

-- CreateIndex
CREATE INDEX "Transaction_storeId_status_idx" ON "Transaction"("storeId", "status");
