import { PrismaClient } from "@prisma/client";
import { User, Wallet } from "../../types";

const prisma = new PrismaClient();

export const getUser = async (userId: string): Promise<User> => {
  const user = await prisma.user_details.findUnique({
    where: {
      user_id: userId,
    },
  });
  console.log("user", user);
  if (!user) {
    throw new Error();
  }
  console.log("user2", user);
  return {
    rowId: user.row_id,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    userId: user.user_id,
    username: user.username,
  };
};

export const getUserWallets = async (rowId: bigint): Promise<Wallet[]> => {
  const wallets = await prisma.user_wallet_details.findMany({
    where: {
      user_id: rowId,
    },
    select: {
      wallet_type: true,
      wallet_address: true,
      wallet_private_key: true,
    },
  });

  return wallets.map((wallet) => ({
    walletType: wallet.wallet_type,
    walletPublicAddress: wallet.wallet_address,
    walletPrivateKey: wallet.wallet_private_key,
  }));
};
