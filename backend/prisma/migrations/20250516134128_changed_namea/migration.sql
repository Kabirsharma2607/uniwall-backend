/*
  Warnings:

  - You are about to drop the column `createdAt` on the `admin_wallet_details` table. All the data in the column will be lost.
  - You are about to drop the column `privateKey` on the `admin_wallet_details` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `admin_wallet_details` table. All the data in the column will be lost.
  - You are about to drop the column `walletAddress` on the `admin_wallet_details` table. All the data in the column will be lost.
  - You are about to drop the column `walletType` on the `admin_wallet_details` table. All the data in the column will be lost.
  - Added the required column `private_key` to the `admin_wallet_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `admin_wallet_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wallet_address` to the `admin_wallet_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wallet_type` to the `admin_wallet_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admin_wallet_details" DROP COLUMN "createdAt",
DROP COLUMN "privateKey",
DROP COLUMN "updatedAt",
DROP COLUMN "walletAddress",
DROP COLUMN "walletType",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "private_key" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "wallet_address" TEXT NOT NULL,
ADD COLUMN     "wallet_type" "wallet_type" NOT NULL;
