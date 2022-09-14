-- CreateTable
CREATE TABLE "Offers" (
    "id" TEXT NOT NULL,
    "deliveryTime" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" BIGINT NOT NULL,

    CONSTRAINT "Offers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Offers_id_key" ON "Offers"("id");
