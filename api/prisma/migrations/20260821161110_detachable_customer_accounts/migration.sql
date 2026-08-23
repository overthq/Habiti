-- AlterTable
ALTER TABLE "LedgerAccount" ADD COLUMN     "detachedAt" TIMESTAMP(3),
ADD COLUMN     "formerUserId" TEXT;

-- The platform-account uniqueness index was too broad.
--
-- It said "at most one account of each kind with no owner", which is right for
-- genuinely platform-scoped kinds but wrong for a detached customer account:
-- two customers deleting their accounts would both leave a CustomerCredit row
-- with a null owner, and the second would collide with the first.
--
-- Narrow it to the kinds that really are singletons.
DROP INDEX "LedgerAccount_platform_kind_key";

CREATE UNIQUE INDEX "LedgerAccount_platform_kind_key"
  ON "LedgerAccount"("kind")
  WHERE "storeId" IS NULL
    AND "userId" IS NULL
    AND "kind" IN ('PlatformCash', 'PlatformFeeRevenue');

-- A detached account records who it used to belong to, and vice versa.
ALTER TABLE "LedgerAccount" ADD CONSTRAINT "LedgerAccount_detach_consistent"
  CHECK (
    ("detachedAt" IS NULL AND "formerUserId" IS NULL)
    OR ("detachedAt" IS NOT NULL AND "formerUserId" IS NOT NULL)
  );
