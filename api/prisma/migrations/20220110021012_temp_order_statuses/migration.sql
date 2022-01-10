-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Pending', 'Cancelled', 'Delivered');

-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_userId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_productId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_storeId_fkey";

-- DropForeignKey
ALTER TABLE "StoreFollower" DROP CONSTRAINT "StoreFollower_followerId_fkey";

-- DropForeignKey
ALTER TABLE "StoreFollower" DROP CONSTRAINT "StoreFollower_storeId_fkey";

-- DropForeignKey
ALTER TABLE "StoreManager" DROP CONSTRAINT "StoreManager_managerId_fkey";

-- DropForeignKey
ALTER TABLE "StoreManager" DROP CONSTRAINT "StoreManager_storeId_fkey";

-- DropForeignKey
ALTER TABLE "WatchlistProduct" DROP CONSTRAINT "WatchlistProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "WatchlistProduct" DROP CONSTRAINT "WatchlistProduct_userId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT E'Pending';

-- AddForeignKey
ALTER TABLE "WatchlistProduct" ADD CONSTRAINT "WatchlistProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistProduct" ADD CONSTRAINT "WatchlistProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreManager" ADD CONSTRAINT "StoreManager_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreManager" ADD CONSTRAINT "StoreManager_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreFollower" ADD CONSTRAINT "StoreFollower_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreFollower" ADD CONSTRAINT "StoreFollower_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
