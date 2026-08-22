-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('Asset', 'Liability', 'Revenue', 'Expense');

-- CreateEnum
CREATE TYPE "AccountKind" AS ENUM ('PlatformCash', 'PlatformFeeRevenue', 'StorePending', 'StoreAvailable', 'StorePayoutInTransit', 'CustomerCredit');

-- CreateEnum
CREATE TYPE "EntryDirection" AS ENUM ('Debit', 'Credit');

-- CreateEnum
CREATE TYPE "LedgerReason" AS ENUM ('OpeningBalance', 'OrderPaid', 'OrderCompleted', 'OrderCancelledBeforeCompletion', 'RefundIssued', 'CustomerCreditWithdrawn', 'PayoutRequested', 'PayoutSettled', 'PayoutFailed', 'SubscriptionFee', 'ManualAdjustment');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('Processing', 'Settled', 'Failed');

-- CreateEnum
CREATE TYPE "WebhookEventStatus" AS ENUM ('Received', 'Processed', 'Failed', 'Skipped');

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "ledgerSequence" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "pendingPayouts" BIGINT NOT NULL DEFAULT 0,
ALTER COLUMN "realizedRevenue" SET DATA TYPE BIGINT,
ALTER COLUMN "unrealizedRevenue" SET DATA TYPE BIGINT,
ALTER COLUMN "paidOut" SET DATA TYPE BIGINT;

-- CreateTable
CREATE TABLE "LedgerAccount" (
    "id" TEXT NOT NULL,
    "kind" "AccountKind" NOT NULL,
    "type" "AccountType" NOT NULL,
    "storeId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerTransaction" (
    "id" TEXT NOT NULL,
    "sequence" BIGSERIAL NOT NULL,
    "reason" "LedgerReason" NOT NULL,
    "description" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "orderId" TEXT,
    "payoutRequestId" TEXT,
    "webhookEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "direction" "EntryDirection" NOT NULL,
    "amount" BIGINT NOT NULL,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreStatementEntry" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "sequence" BIGINT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'Success',
    "amount" BIGINT NOT NULL,
    "balanceAfter" BIGINT NOT NULL,
    "description" TEXT,
    "orderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreStatementEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayoutRequest" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'Processing',
    "providerRef" TEXT,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayoutRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "WebhookEventStatus" NOT NULL DEFAULT 'Received',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LedgerAccount_storeId_idx" ON "LedgerAccount"("storeId");

-- CreateIndex
CREATE INDEX "LedgerAccount_userId_idx" ON "LedgerAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerTransaction_idempotencyKey_key" ON "LedgerTransaction"("idempotencyKey");

-- CreateIndex
CREATE INDEX "LedgerTransaction_orderId_idx" ON "LedgerTransaction"("orderId");

-- CreateIndex
CREATE INDEX "LedgerTransaction_payoutRequestId_idx" ON "LedgerTransaction"("payoutRequestId");

-- CreateIndex
CREATE INDEX "LedgerTransaction_sequence_idx" ON "LedgerTransaction"("sequence");

-- CreateIndex
CREATE INDEX "LedgerEntry_transactionId_idx" ON "LedgerEntry"("transactionId");

-- CreateIndex
CREATE INDEX "LedgerEntry_accountId_id_idx" ON "LedgerEntry"("accountId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "StoreStatementEntry_transactionId_key" ON "StoreStatementEntry"("transactionId");

-- CreateIndex
CREATE INDEX "StoreStatementEntry_storeId_sequence_idx" ON "StoreStatementEntry"("storeId", "sequence");

-- CreateIndex
CREATE INDEX "StoreStatementEntry_storeId_type_idx" ON "StoreStatementEntry"("storeId", "type");

-- CreateIndex
CREATE INDEX "StoreStatementEntry_storeId_createdAt_idx" ON "StoreStatementEntry"("storeId", "createdAt");

-- CreateIndex
CREATE INDEX "StoreStatementEntry_orderId_idx" ON "StoreStatementEntry"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "PayoutRequest_providerRef_key" ON "PayoutRequest"("providerRef");

-- CreateIndex
CREATE INDEX "PayoutRequest_storeId_status_idx" ON "PayoutRequest"("storeId", "status");

-- CreateIndex
CREATE INDEX "PayoutRequest_storeId_createdAt_idx" ON "PayoutRequest"("storeId", "createdAt");

-- CreateIndex
CREATE INDEX "WebhookEvent_status_receivedAt_idx" ON "WebhookEvent"("status", "receivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_provider_externalId_key" ON "WebhookEvent"("provider", "externalId");

-- AddForeignKey
ALTER TABLE "LedgerAccount" ADD CONSTRAINT "LedgerAccount_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerAccount" ADD CONSTRAINT "LedgerAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerTransaction" ADD CONSTRAINT "LedgerTransaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerTransaction" ADD CONSTRAINT "LedgerTransaction_payoutRequestId_fkey" FOREIGN KEY ("payoutRequestId") REFERENCES "PayoutRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerTransaction" ADD CONSTRAINT "LedgerTransaction_webhookEventId_fkey" FOREIGN KEY ("webhookEventId") REFERENCES "WebhookEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "LedgerTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "LedgerAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreStatementEntry" ADD CONSTRAINT "StoreStatementEntry_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreStatementEntry" ADD CONSTRAINT "StoreStatementEntry_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "LedgerTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreStatementEntry" ADD CONSTRAINT "StoreStatementEntry_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoutRequest" ADD CONSTRAINT "PayoutRequest_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- Ledger invariants.
--
-- Everything below is hand-written: Prisma's schema language cannot express
-- partial indexes, triggers or check constraints. If you regenerate this
-- migration from a schema diff, re-append this block.
-- ---------------------------------------------------------------------------

-- Account ownership uniqueness.
--
-- `@@unique([kind, storeId, userId])` would not work: Postgres treats NULLs as
-- distinct, so it would happily allow two `PlatformCash` rows (both owners
-- NULL) and two `StoreAvailable` rows for the same store. Three partial
-- indexes say what we actually mean.
CREATE UNIQUE INDEX "LedgerAccount_store_kind_key"
  ON "LedgerAccount"("kind", "storeId") WHERE "storeId" IS NOT NULL;
CREATE UNIQUE INDEX "LedgerAccount_user_kind_key"
  ON "LedgerAccount"("kind", "userId") WHERE "userId" IS NOT NULL;
CREATE UNIQUE INDEX "LedgerAccount_platform_kind_key"
  ON "LedgerAccount"("kind") WHERE "storeId" IS NULL AND "userId" IS NULL;

-- An account belongs to a store, or a user, or the platform -- never two at once.
ALTER TABLE "LedgerAccount" ADD CONSTRAINT "LedgerAccount_single_owner"
  CHECK (NOT ("storeId" IS NOT NULL AND "userId" IS NOT NULL));

-- Amounts are magnitudes; sign is carried by `direction`. This is the
-- constraint that stops a negative amount silently inverting an entry.
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_amount_positive"
  CHECK ("amount" > 0);

-- Journals are immutable. Corrections are reversing journals, never edits --
-- that is what makes a bad batch rollback-able and auditable.
--
-- Note these are row-level triggers, so they do not fire on TRUNCATE or DROP
-- TABLE. `prisma migrate reset` still works in development.
CREATE OR REPLACE FUNCTION reject_ledger_mutation() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION
    'Ledger rows are immutable (table %, operation %). Post a reversing journal instead.',
    TG_TABLE_NAME, TG_OP;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "LedgerTransaction_immutable"
  BEFORE UPDATE OR DELETE ON "LedgerTransaction"
  FOR EACH ROW EXECUTE FUNCTION reject_ledger_mutation();

CREATE TRIGGER "LedgerEntry_immutable"
  BEFORE UPDATE OR DELETE ON "LedgerEntry"
  FOR EACH ROW EXECUTE FUNCTION reject_ledger_mutation();

-- Every journal balances.
--
-- DEFERRABLE INITIALLY DEFERRED is load-bearing: entries are inserted one row
-- at a time, so a journal is legitimately unbalanced between the first insert
-- and the last. Checking eagerly would reject every multi-entry journal. This
-- fires at COMMIT, when the journal is complete.
CREATE OR REPLACE FUNCTION assert_ledger_balanced() RETURNS trigger AS $$
DECLARE
  total_debit  BIGINT;
  total_credit BIGINT;
  entry_count  INTEGER;
BEGIN
  SELECT
    COALESCE(SUM("amount") FILTER (WHERE "direction" = 'Debit'), 0),
    COALESCE(SUM("amount") FILTER (WHERE "direction" = 'Credit'), 0),
    COUNT(*)
  INTO total_debit, total_credit, entry_count
  FROM "LedgerEntry"
  WHERE "transactionId" = NEW."transactionId";

  -- The journal was rolled back out from under us; nothing to check.
  IF entry_count = 0 THEN
    RETURN NULL;
  END IF;

  IF entry_count < 2 THEN
    RAISE EXCEPTION
      'Journal % has % entry; a double-entry journal needs at least two',
      NEW."transactionId", entry_count;
  END IF;

  IF total_debit <> total_credit THEN
    RAISE EXCEPTION
      'Journal % does not balance (debits %, credits %)',
      NEW."transactionId", total_debit, total_credit;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER "LedgerEntry_balanced"
  AFTER INSERT ON "LedgerEntry"
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION assert_ledger_balanced();
