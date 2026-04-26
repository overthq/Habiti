-- Indexes for foreign keys / hot-path queries.
-- Created concurrently in production via raw SQL — Prisma's regular
-- CREATE INDEX would block writes on large tables.

-- Product
CREATE INDEX IF NOT EXISTS "Product_storeId_idx" ON "Product"("storeId");
CREATE INDEX IF NOT EXISTS "Product_storeId_status_idx" ON "Product"("storeId", "status");
CREATE INDEX IF NOT EXISTS "Product_status_idx" ON "Product"("status");

-- Order
CREATE INDEX IF NOT EXISTS "Order_userId_createdAt_idx" ON "Order"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "Order_storeId_createdAt_idx" ON "Order"("storeId", "createdAt");
CREATE INDEX IF NOT EXISTS "Order_storeId_status_idx" ON "Order"("storeId", "status");

-- OrderProduct
CREATE INDEX IF NOT EXISTS "OrderProduct_productId_idx" ON "OrderProduct"("productId");

-- CartProduct
CREATE INDEX IF NOT EXISTS "CartProduct_productId_idx" ON "CartProduct"("productId");

-- WatchlistProduct
CREATE INDEX IF NOT EXISTS "WatchlistProduct_productId_idx" ON "WatchlistProduct"("productId");

-- Image
CREATE INDEX IF NOT EXISTS "Image_productId_idx" ON "Image"("productId");

-- StoreManager
CREATE INDEX IF NOT EXISTS "StoreManager_managerId_idx" ON "StoreManager"("managerId");

-- StoreFollower
CREATE INDEX IF NOT EXISTS "StoreFollower_followerId_idx" ON "StoreFollower"("followerId");

-- Card
CREATE INDEX IF NOT EXISTS "Card_userId_idx" ON "Card"("userId");

-- ProductCategory
CREATE INDEX IF NOT EXISTS "ProductCategory_productId_idx" ON "ProductCategory"("productId");

-- ProductReview
CREATE INDEX IF NOT EXISTS "ProductReview_productId_idx" ON "ProductReview"("productId");
CREATE INDEX IF NOT EXISTS "ProductReview_userId_idx" ON "ProductReview"("userId");

-- Address
CREATE INDEX IF NOT EXISTS "Address_userId_idx" ON "Address"("userId");
CREATE INDEX IF NOT EXISTS "Address_storeId_idx" ON "Address"("storeId");
