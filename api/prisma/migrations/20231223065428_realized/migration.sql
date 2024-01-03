/*
  Warnings:

  - You are about to drop the column `revenue` on the `Store` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('Pending', 'Success', 'Failure');

-- AlterTable
ALTER TABLE "Payout" ADD COLUMN     "status" "PayoutStatus" NOT NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "revenue",
ADD COLUMN     "realizedRevenue" INTEGER NOT NULL DEFAULT 0;
