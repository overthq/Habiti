-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('Processing', 'Success', 'Failure');

-- AlterTable: add status column with default
ALTER TABLE "Transaction" ADD COLUMN "status" "TransactionStatus" NOT NULL DEFAULT 'Success';

-- Migrate existing data: set status based on current type
UPDATE "Transaction" SET "status" = 'Processing' WHERE "type" = 'PayoutInitiated';
UPDATE "Transaction" SET "status" = 'Failure' WHERE "type" = 'PayoutReversed';

-- Migrate TransactionType values: collapse payout variants into 'Payout'
-- and rename 'RevenueRealization' to 'Revenue'
-- Recreate enum in one shot to avoid "unsafe use of new value" in transactions

-- Step 1: Rename old enum
ALTER TYPE "TransactionType" RENAME TO "TransactionType_old";

-- Step 2: Create new enum with final values
CREATE TYPE "TransactionType" AS ENUM ('Revenue', 'Payout', 'SubscriptionFee', 'Adjustment', 'Refund');

-- Step 3: Migrate column, mapping old values to new ones via text conversion
ALTER TABLE "Transaction"
  ALTER COLUMN "type" TYPE "TransactionType"
  USING (
    CASE "type"::text
      WHEN 'RevenueRealization' THEN 'Revenue'
      WHEN 'PayoutInitiated' THEN 'Payout'
      WHEN 'PayoutCompleted' THEN 'Payout'
      WHEN 'PayoutReversed' THEN 'Payout'
      ELSE "type"::text
    END
  )::"TransactionType";

-- Step 4: Drop old enum
DROP TYPE "TransactionType_old";

-- CreateIndex
CREATE INDEX "Transaction_storeId_status_idx" ON "Transaction"("storeId", "status");
