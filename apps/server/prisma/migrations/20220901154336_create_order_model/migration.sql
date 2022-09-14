-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('complete', 'incomplete');

-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "OrderStatus" NOT NULL DEFAULT 'incomplete',

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Orders_id_key" ON "Orders"("id");
