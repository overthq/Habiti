-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "unlisted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "suspended" BOOLEAN NOT NULL DEFAULT false;
