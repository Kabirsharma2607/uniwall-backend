/*
  Warnings:

  - A unique constraint covering the columns `[user_id,wallet_type]` on the table `user_wallet_details` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_wallet_details_user_id_wallet_type_key" ON "user_wallet_details"("user_id", "wallet_type");
