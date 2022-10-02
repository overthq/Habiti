/*
  Warnings:

  - You are about to drop the column `imageId` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the `ProductImage` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[storeId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_imageId_fkey";

-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_productId_fkey";

-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_imageId_fkey";

-- DropIndex
DROP INDEX "Image_publicId_key";

-- DropIndex
DROP INDEX "Store_imageId_key";

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "productId" TEXT,
ADD COLUMN     "storeId" TEXT;

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "imageId";

-- DropTable
DROP TABLE "ProductImage";

-- CreateIndex
CREATE UNIQUE INDEX "Image_storeId_key" ON "Image"("storeId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
