-- CreateEnum
CREATE TYPE "wallet_type" AS ENUM ('SOLANA', 'BTC', 'PALO', 'ETH');

-- CreateTable
CREATE TABLE "user_details" (
    "row_id" BIGSERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_details_pkey" PRIMARY KEY ("row_id")
);

-- CreateTable
CREATE TABLE "user_auth_details" (
    "row_id" BIGSERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "words_secret" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_auth_details_pkey" PRIMARY KEY ("row_id")
);

-- CreateTable
CREATE TABLE "user_wallet_details" (
    "row_id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "raw_user_id" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "wallet_type" "wallet_type" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_wallet_details_pkey" PRIMARY KEY ("row_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_details_user_id_key" ON "user_details"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_details_username_key" ON "user_details"("username");

-- CreateIndex
CREATE INDEX "user_details_row_id_idx" ON "user_details"("row_id");

-- CreateIndex
CREATE INDEX "user_details_user_id_idx" ON "user_details"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_details_user_id_key" ON "user_auth_details"("user_id");

-- CreateIndex
CREATE INDEX "user_auth_details_row_id_idx" ON "user_auth_details"("row_id");

-- CreateIndex
CREATE INDEX "user_auth_details_user_id_idx" ON "user_auth_details"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_wallet_details_raw_user_id_key" ON "user_wallet_details"("raw_user_id");

-- CreateIndex
CREATE INDEX "user_wallet_details_row_id_idx" ON "user_wallet_details"("row_id");

-- CreateIndex
CREATE INDEX "user_wallet_details_user_id_idx" ON "user_wallet_details"("user_id");

-- AddForeignKey
ALTER TABLE "user_auth_details" ADD CONSTRAINT "user_auth_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_details"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_wallet_details" ADD CONSTRAINT "user_wallet_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_details"("row_id") ON DELETE RESTRICT ON UPDATE CASCADE;
