-- AlterTable
ALTER TABLE "Offers" ADD COLUMN     "postingsId" TEXT;

-- AlterTable
ALTER TABLE "Postings" ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "Reviews" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_id_key" ON "Reviews"("id");

-- AddForeignKey
ALTER TABLE "Postings" ADD CONSTRAINT "Postings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offers" ADD CONSTRAINT "Offers_postingsId_fkey" FOREIGN KEY ("postingsId") REFERENCES "Postings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
