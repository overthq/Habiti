-- Moves store bank details off `Store` and into a table that can hold more
-- than one account per store.
--
-- Three loose nullable columns on `Store` could not express "unset", could not
-- record which account a past payout went to, and rode along in every public
-- store read. `StorePayoutAccount` rows are append-only: changing where a
-- store gets paid inserts a row and deactivates the old one.

-- CreateEnum
CREATE TYPE "PayoutAccountStatus" AS ENUM ('Active', 'Inactive');

-- CreateTable
CREATE TABLE "StorePayoutAccount" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'paystack',
    "accountNumber" TEXT NOT NULL,
    "bankCode" TEXT NOT NULL,
    "accountName" TEXT,
    "bankName" TEXT,
    "recipientRef" TEXT NOT NULL,
    "label" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "status" "PayoutAccountStatus" NOT NULL DEFAULT 'Active',
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deactivatedAt" TIMESTAMP(3),

    CONSTRAINT "StorePayoutAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
-- Store-scoped rather than global: one merchant running two stores can settle
-- both to the same bank account, and Paystack returns the same recipient code
-- for it. The existing data already contains such a pair.
CREATE UNIQUE INDEX "StorePayoutAccount_storeId_provider_recipientRef_key"
    ON "StorePayoutAccount"("storeId", "provider", "recipientRef");

-- CreateIndex
CREATE UNIQUE INDEX "StorePayoutAccount_storeId_provider_bankCode_accountNumber_key"
    ON "StorePayoutAccount"("storeId", "provider", "bankCode", "accountNumber");

-- CreateIndex
CREATE INDEX "StorePayoutAccount_storeId_status_idx"
    ON "StorePayoutAccount"("storeId", "status");

-- A partial unique index, which Prisma cannot express in the schema. It is
-- what makes "one default account" true in the database rather than only in
-- application code, and while the per-store cap is one it doubles as the cap:
-- every account created under the cap is the default, so a concurrent second
-- insert collides here instead of racing the count check.
--
-- Because a partial unique index cannot be deferred, switching defaults must
-- clear the old row before setting the new one, within one transaction.
CREATE UNIQUE INDEX "store_one_active_default_payout_account"
    ON "StorePayoutAccount"("storeId")
    WHERE "isDefault" AND "status" = 'Active';

-- AddForeignKey
ALTER TABLE "StorePayoutAccount" ADD CONSTRAINT "StorePayoutAccount_storeId_fkey"
    FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "PayoutRequest" ADD COLUMN "payoutAccountId" TEXT;

-- CreateIndex
CREATE INDEX "PayoutRequest_payoutAccountId_idx" ON "PayoutRequest"("payoutAccountId");

-- AddForeignKey
ALTER TABLE "PayoutRequest" ADD CONSTRAINT "PayoutRequest_payoutAccountId_fkey"
    FOREIGN KEY ("payoutAccountId") REFERENCES "StorePayoutAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Backfill: one account per store that had complete bank details. Stores with
-- a partial set (an account number but no recipient code, which the old update
-- path could produce) are deliberately skipped -- they could not be paid out
-- before this migration either, and inventing a recipient code here would make
-- an unpayable account look payable.
--
-- `accountName` and `bankName` stay null: the old columns never stored them.
-- `verifiedAt` likewise, since the original verification time is unknown.
INSERT INTO "StorePayoutAccount" (
    "id", "storeId", "provider", "accountNumber", "bankCode",
    "recipientRef", "isDefault", "status", "createdAt", "updatedAt"
)
SELECT
    gen_random_uuid()::text,
    "id",
    'paystack',
    "bankAccountNumber",
    "bankCode",
    "bankAccountReference",
    true,
    'Active',
    "createdAt",
    "updatedAt"
FROM "Store"
WHERE "bankAccountNumber" IS NOT NULL
  AND "bankCode" IS NOT NULL
  AND "bankAccountReference" IS NOT NULL;

-- Point existing payouts at the backfilled account. This is the store's
-- current account, not provably the one each payout was sent to -- history
-- before this migration simply was not recorded. It is right for every store
-- that never changed accounts, and it is the closest available answer for the
-- rest.
UPDATE "PayoutRequest" p
SET "payoutAccountId" = a."id"
FROM "StorePayoutAccount" a
WHERE a."storeId" = p."storeId"
  AND p."payoutAccountId" IS NULL;

-- DropColumn
ALTER TABLE "Store" DROP COLUMN "bankAccountNumber",
                    DROP COLUMN "bankCode",
                    DROP COLUMN "bankAccountReference";
