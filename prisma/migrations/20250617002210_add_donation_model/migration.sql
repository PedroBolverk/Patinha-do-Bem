-- CreateTable
CREATE TABLE "Donation" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),
    "amount" INTEGER NOT NULL,
    "donorName" TEXT,
    "donorEmail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "postId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
