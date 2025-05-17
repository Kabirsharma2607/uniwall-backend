import { PrismaClient, wallet_type } from "@prisma/client";
import { walletBalanceMap } from "./walletMap";

const prisma = new PrismaClient();

export async function getAdminWithMinBalance(
  wallet_type: wallet_type,
  minBalance: number
) {
  const admin = await prisma.admin_wallet_details.findFirst({
    where: { wallet_type },
  });
  if (!admin) return null;

  const getBalance = walletBalanceMap[wallet_type];
  const balance = await getBalance(admin.wallet_address);

  return Number(balance) >= minBalance
    ? { ...admin, liveBalance: Number(balance) }
    : null;
}
