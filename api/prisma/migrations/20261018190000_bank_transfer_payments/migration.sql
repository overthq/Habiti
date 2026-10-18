-- CreateEnum
CREATE TYPE "BankTransferStatus" AS ENUM ('Pending', 'Succeeded', 'Rejected', 'Expired', 'Failed');

-- CreateTable
CREATE TABLE "BankTransferPayment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "accountName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "bankSlug" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "status" "BankTransferStatus" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankTransferPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BankTransferPayment_reference_key" ON "BankTransferPayment"("reference");

-- CreateIndex
CREATE INDEX "BankTransferPayment_orderId_createdAt_idx" ON "BankTransferPayment"("orderId", "createdAt");

-- One open transfer per order. A rejected or expired attempt can be followed by another.
CREATE UNIQUE INDEX "BankTransferPayment_one_pending_per_order" ON "BankTransferPayment"("orderId") WHERE "status" = 'Pending';

-- AddForeignKey
ALTER TABLE "BankTransferPayment" ADD CONSTRAINT "BankTransferPayment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
