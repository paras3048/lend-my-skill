-- CreateTable
CREATE TABLE "Warnings" (
    "id" TEXT NOT NULL,
    "warnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Warnings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Warnings_id_key" ON "Warnings"("id");

-- AddForeignKey
ALTER TABLE "Warnings" ADD CONSTRAINT "Warnings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
