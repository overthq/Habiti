-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "bankAccountNumber" TEXT,
ADD COLUMN     "bankAccountReference" TEXT,
ADD COLUMN     "bankCode" TEXT;

-- AlterTable
ALTER TABLE "StoreProductCategory" ADD COLUMN     "description" TEXT;
