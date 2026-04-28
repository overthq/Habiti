-- Indexes for foreign keys / hot-path queries.
--
-- IMPORTANT: `CREATE INDEX CONCURRENTLY` cannot run inside a transaction.
-- Prisma 7's migrate engine does *not* wrap migrations in a transaction by
-- default for Postgres, so each statement here runs on its own. Idempotent
-- via `IF NOT EXISTS` so re-runs and partial failures are safe.
--
-- If `prisma migrate deploy` rejects this with a "concurrent index" error,
-- apply manually:
--   psql "$DATABASE_URL" -f migration.sql
-- and then mark it applied:
--   bunx prisma migrate resolve --applied 20260426050542_add_fk_indexes
--
-- A failed CONCURRENTLY build leaves an INVALID index — drop it before
-- retrying:
--   DROP INDEX CONCURRENTLY IF EXISTS "<name>";

-- Product
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Product_storeId_idx" ON "Product"("storeId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Product_storeId_status_idx" ON "Product"("storeId", "status");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Product_status_idx" ON "Product"("status");

-- Order
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Order_userId_createdAt_idx" ON "Order"("userId", "createdAt");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Order_storeId_createdAt_idx" ON "Order"("storeId", "createdAt");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Order_storeId_status_idx" ON "Order"("storeId", "status");

-- OrderProduct
CREATE INDEX CONCURRENTLY IF NOT EXISTS "OrderProduct_productId_idx" ON "OrderProduct"("productId");

-- CartProduct
CREATE INDEX CONCURRENTLY IF NOT EXISTS "CartProduct_productId_idx" ON "CartProduct"("productId");

-- WatchlistProduct
CREATE INDEX CONCURRENTLY IF NOT EXISTS "WatchlistProduct_productId_idx" ON "WatchlistProduct"("productId");

-- Image
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Image_productId_idx" ON "Image"("productId");

-- StoreManager
CREATE INDEX CONCURRENTLY IF NOT EXISTS "StoreManager_managerId_idx" ON "StoreManager"("managerId");

-- StoreFollower
CREATE INDEX CONCURRENTLY IF NOT EXISTS "StoreFollower_followerId_idx" ON "StoreFollower"("followerId");

-- Card
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Card_userId_idx" ON "Card"("userId");

-- ProductCategory
CREATE INDEX CONCURRENTLY IF NOT EXISTS "ProductCategory_productId_idx" ON "ProductCategory"("productId");

-- ProductReview
CREATE INDEX CONCURRENTLY IF NOT EXISTS "ProductReview_productId_idx" ON "ProductReview"("productId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "ProductReview_userId_idx" ON "ProductReview"("userId");

-- Address
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Address_userId_idx" ON "Address"("userId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Address_storeId_idx" ON "Address"("storeId");
