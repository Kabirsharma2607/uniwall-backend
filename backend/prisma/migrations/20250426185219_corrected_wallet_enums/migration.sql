/*
  Warnings:

  - The values [SOLANA] on the enum `wallet_type` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `wallet_private_key` to the `user_wallet_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "wallet_type_new" AS ENUM ('SOL', 'BTC', 'PALO', 'ETH');
ALTER TABLE "user_wallet_details" ALTER COLUMN "wallet_type" TYPE "wallet_type_new" USING ("wallet_type"::text::"wallet_type_new");
ALTER TYPE "wallet_type" RENAME TO "wallet_type_old";
ALTER TYPE "wallet_type_new" RENAME TO "wallet_type";
DROP TYPE "wallet_type_old";
COMMIT;

-- DropIndex
DROP INDEX "user_wallet_details_raw_user_id_key";

-- AlterTable
ALTER TABLE "user_wallet_details" ADD COLUMN     "wallet_private_key" TEXT NOT NULL;
