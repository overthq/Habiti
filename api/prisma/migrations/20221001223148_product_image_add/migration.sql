/*
  Warnings:

  - You are about to drop the column `productId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `Image` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[imageId]` on the table `Store` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_productId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_storeId_fkey";

-- DropIndex
DROP INDEX "Image_storeId_key";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "productId",
DROP COLUMN "storeId";

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "imageId" TEXT;

-- CreateTable
CREATE TABLE "ProductImage" (
    "productId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "default" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductImage_imageId_key" ON "ProductImage"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductImage_productId_imageId_key" ON "ProductImage"("productId", "imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Store_imageId_key" ON "Store"("imageId");

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
