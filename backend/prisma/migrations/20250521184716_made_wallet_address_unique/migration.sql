/*
  Warnings:

  - A unique constraint covering the columns `[wallet_address]` on the table `user_wallet_details` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wallet_private_key]` on the table `user_wallet_details` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_wallet_details_wallet_address_key" ON "user_wallet_details"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "user_wallet_details_wallet_private_key_key" ON "user_wallet_details"("wallet_private_key");
