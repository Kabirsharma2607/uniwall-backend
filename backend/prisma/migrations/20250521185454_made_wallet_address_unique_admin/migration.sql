/*
  Warnings:

  - A unique constraint covering the columns `[wallet_type]` on the table `admin_wallet_details` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "admin_wallet_details_wallet_type_key" ON "admin_wallet_details"("wallet_type");
