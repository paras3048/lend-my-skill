/*
  Warnings:

  - Added the required column `slugifiedTitle` to the `Postings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Postings" ADD COLUMN     "slugifiedTitle" TEXT NOT NULL;
