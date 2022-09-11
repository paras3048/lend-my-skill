/*
  Warnings:

  - Added the required column `heroImage` to the `Postings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Postings" ADD COLUMN     "heroImage" TEXT NOT NULL,
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
