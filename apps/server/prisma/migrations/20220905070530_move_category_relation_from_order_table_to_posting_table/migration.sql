/*
  Warnings:

  - You are about to drop the column `ordersId` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_ordersId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "ordersId",
ADD COLUMN     "postingsId" TEXT;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_postingsId_fkey" FOREIGN KEY ("postingsId") REFERENCES "Postings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
