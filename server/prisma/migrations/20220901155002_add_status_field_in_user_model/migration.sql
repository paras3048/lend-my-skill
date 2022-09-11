-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('online', 'offline', 'dnd');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'offline';
