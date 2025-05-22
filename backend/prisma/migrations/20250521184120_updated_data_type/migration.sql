/*
  Warnings:

  - The `wallet_balance` column on the `user_wallet_details` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "user_wallet_details" DROP COLUMN "wallet_balance",
ADD COLUMN     "wallet_balance" DOUBLE PRECISION NOT NULL DEFAULT 0;
