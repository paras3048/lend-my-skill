/*
  Warnings:

  - You are about to drop the column `receiverId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `buyerId` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "receiverId",
DROP COLUMN "senderId",
ADD COLUMN     "buyerId" TEXT NOT NULL,
ADD COLUMN     "sellerId" TEXT NOT NULL;
