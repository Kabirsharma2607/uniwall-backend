/*
  Warnings:

  - Added the required column `privateKey` to the `admin_wallet_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admin_wallet_details" ADD COLUMN     "privateKey" TEXT NOT NULL;
