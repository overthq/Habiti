-- Hand-written: these are renames and a data move, which a schema diff would
-- turn into drop-and-recreate.

-- AlterEnum
ALTER TYPE "AccountKind" RENAME VALUE 'StorePending' TO 'Unrealized';
ALTER TYPE "AccountKind" RENAME VALUE 'StoreAvailable' TO 'Available';
ALTER TYPE "AccountKind" RENAME VALUE 'StorePayoutInTransit' TO 'PendingPayouts';

-- AlterTable
ALTER TABLE "LedgerAccount" DROP COLUMN "type";

-- DropEnum
DROP TYPE "AccountType";

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "ledgerSequence";

-- RenameTable
ALTER TABLE "PayoutRequest" RENAME TO "Payout";
ALTER TABLE "Payout" RENAME CONSTRAINT "PayoutRequest_pkey" TO "Payout_pkey";
ALTER TABLE "Payout" RENAME CONSTRAINT "PayoutRequest_storeId_fkey" TO "Payout_storeId_fkey";
ALTER TABLE "Payout" RENAME CONSTRAINT "PayoutRequest_payoutAccountId_fkey" TO "Payout_payoutAccountId_fkey";
ALTER INDEX "PayoutRequest_providerRef_key" RENAME TO "Payout_providerRef_key";
ALTER INDEX "PayoutRequest_storeId_status_idx" RENAME TO "Payout_storeId_status_idx";
ALTER INDEX "PayoutRequest_storeId_createdAt_idx" RENAME TO "Payout_storeId_createdAt_idx";
ALTER INDEX "PayoutRequest_payoutAccountId_idx" RENAME TO "Payout_payoutAccountId_idx";

-- RenameColumn
ALTER TABLE "LedgerTransaction" RENAME COLUMN "payoutRequestId" TO "payoutId";
ALTER TABLE "LedgerTransaction" RENAME CONSTRAINT "LedgerTransaction_payoutRequestId_fkey" TO "LedgerTransaction_payoutId_fkey";
ALTER INDEX "LedgerTransaction_payoutRequestId_idx" RENAME TO "LedgerTransaction_payoutId_idx";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "amount" SET DATA TYPE BIGINT,
ALTER COLUMN "balanceAfter" SET DATA TYPE BIGINT,
ADD COLUMN "payoutId" TEXT;

-- CreateIndex
CREATE INDEX "Transaction_payoutId_idx" ON "Transaction"("payoutId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_payoutId_fkey" FOREIGN KEY ("payoutId") REFERENCES "Payout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- `Transaction` is the merchant-facing list again, so everything recorded in
-- `StoreStatementEntry` since the ledger cutover moves into it, keeping its id.
--
-- Payouts that were in flight at the cutover exist twice: as a frozen
-- `Transaction` row (whose id became the payout's id) and as a statement entry
-- that kept tracking the status. The statement entry is the current one.
DELETE FROM "Transaction" t
USING "Payout" p
WHERE t."id" = p."id"
  AND EXISTS (
    SELECT 1
    FROM "StoreStatementEntry" s
    JOIN "LedgerTransaction" l ON l."id" = s."transactionId"
    WHERE l."payoutId" = p."id"
  );

-- Opening balances are left out: the rows they summarised are already in
-- `Transaction`.
INSERT INTO "Transaction" (
    "id", "storeId", "type", "status", "amount", "description",
    "orderId", "payoutId", "balanceAfter", "createdAt", "updatedAt"
)
SELECT
    s."id", s."storeId", s."type", s."status", s."amount", s."description",
    s."orderId", l."payoutId", s."balanceAfter", s."createdAt", s."updatedAt"
FROM "StoreStatementEntry" s
JOIN "LedgerTransaction" l ON l."id" = s."transactionId"
WHERE l."reason" <> 'OpeningBalance';

-- DropTable
DROP TABLE "StoreStatementEntry";
