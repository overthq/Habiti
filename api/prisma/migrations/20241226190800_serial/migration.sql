/*
  Warnings:

  - A unique constraint covering the columns `[storeId,serialNumber]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "serialNumber" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "orderCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Order_storeId_serialNumber_key" ON "Order"("storeId", "serialNumber");
