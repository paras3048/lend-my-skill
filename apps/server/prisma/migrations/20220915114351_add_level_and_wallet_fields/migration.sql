-- CreateEnum
CREATE TYPE "Levels" AS ENUM ('newSeller', 'level1', 'level2', 'bestSeller');

-- AlterTable
ALTER TABLE "Postings" ADD COLUMN     "acceptingOrders" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "level" "Levels" NOT NULL DEFAULT 'newSeller',
ADD COLUMN     "wallet" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "walletUpdatedAt" TIMESTAMP(3);
