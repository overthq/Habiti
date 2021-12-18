-- CreateTable
CREATE TABLE "WatchlistProduct" (
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistProduct_userId_productId_key" ON "WatchlistProduct"("userId", "productId");

-- AddForeignKey
ALTER TABLE "WatchlistProduct" ADD CONSTRAINT "WatchlistProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistProduct" ADD CONSTRAINT "WatchlistProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
