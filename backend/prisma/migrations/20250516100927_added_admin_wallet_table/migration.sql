-- CreateTable
CREATE TABLE "admin_wallet_details" (
    "id" TEXT NOT NULL,
    "walletType" "wallet_type" NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_wallet_details_pkey" PRIMARY KEY ("id")
);
