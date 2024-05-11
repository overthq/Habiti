/*
  Warnings:

  - You are about to drop the column `payedOut` on the `Store` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Store" DROP COLUMN "payedOut",
ADD COLUMN     "paidOut" INTEGER NOT NULL DEFAULT 0;
