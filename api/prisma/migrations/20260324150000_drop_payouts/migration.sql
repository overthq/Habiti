-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT IF EXISTS "Transaction_payoutId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "Transaction_payoutId_idx";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN IF EXISTS "payoutId";

-- DropTable
DROP TABLE IF EXISTS "Payout";

-- DropEnum
DROP TYPE IF EXISTS "PayoutStatus";
