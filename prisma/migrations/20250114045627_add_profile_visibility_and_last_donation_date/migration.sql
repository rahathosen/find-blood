-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastDonationDate" TIMESTAMP(3);
