-- CreateTable
CREATE TABLE "user_wallets_qr_codes" (
    "row_id" BIGSERIAL NOT NULL,
    "wallet_id" BIGINT NOT NULL,
    "qr_code_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_wallets_qr_codes_pkey" PRIMARY KEY ("row_id")
);

-- CreateIndex
CREATE INDEX "user_wallets_qr_codes_wallet_id_idx" ON "user_wallets_qr_codes"("wallet_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_wallets_qr_codes_wallet_id_key" ON "user_wallets_qr_codes"("wallet_id");

-- AddForeignKey
ALTER TABLE "user_wallets_qr_codes" ADD CONSTRAINT "user_wallets_qr_codes_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "user_wallet_details"("row_id") ON DELETE RESTRICT ON UPDATE CASCADE;
