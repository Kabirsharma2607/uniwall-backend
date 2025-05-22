import { PrismaClient, wallet_type } from "@prisma/client";
import { User, Wallet, WalletQrType } from "../../types";
import { GeneratedWalletKeyPairsType } from "./utils";
import { WalletType } from "@kabir.26/uniwall-commons";

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
    userState: user.user_state,
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

export const getWalletAddress = async (
  userId: bigint,
  walletType: wallet_type
): Promise<{
  privateKey: string;
  publicKey: string;
}> => {
  try {
    const walletAddress = await prisma.user_wallet_details.findUnique({
      where: {
        user_id_wallet_type: {
          user_id: userId,
          wallet_type: walletType,
        },
      },
    });

    if (!walletAddress) {
      throw new Error("Wallet not found");
    }

    return {
      privateKey: walletAddress.wallet_private_key,
      publicKey: walletAddress.wallet_address,
    };
  } catch (error) {
    console.error("Error fetching wallet address:", error);
    throw new Error("Failed to retrieve wallet address");
  }
};

export const createUserWallets = async (
  userId: bigint,
  rawUserId: string,
  wallets: GeneratedWalletKeyPairsType[]
): Promise<
  {
    row_id: bigint;
    user_id: bigint;
    raw_user_id: string;
    wallet_address: string;
    wallet_private_key: string;
    wallet_type: wallet_type;
    created_at: Date;
    updated_at: Date;
  }[]
> => {
  const createdWallets = await Promise.all(
    wallets.map((wallet) =>
      prisma.user_wallet_details.create({
        data: {
          user_id: userId,
          raw_user_id: rawUserId,
          wallet_address: wallet.keyPair.publicKey,
          wallet_private_key: wallet.keyPair.privateKey,
          wallet_type: wallet.walletType,
        },
      })
    )
  );

  return createdWallets;
};

export const getUserWalletQrCodes = async (
  userId: bigint
): Promise<WalletQrType[]> => {
  const qrCodes = await prisma.user_wallets_qr_codes.findMany({
    where: {
      user_wallet: {
        user_id: userId,
      },
    },
    select: {
      qr_code_url: true,
      user_wallet: {
        select: {
          wallet_address: true,
          wallet_type: true,
        },
      },
    },
  });

  return qrCodes.map((item) => ({
    walletAddress: item.user_wallet.wallet_address,
    walletType: item.user_wallet.wallet_type,
    qrCodeUrl: item.qr_code_url,
  }));
};

export const createQrEntryInDB = async (rowId: bigint, qrCode: string) => {
  await prisma.user_wallets_qr_codes.create({
    data: {
      wallet_id: rowId,
      qr_code_url: qrCode,
    },
  });
};

export const updateWalletBalance = async (
  fromWalletType: WalletType,
  receiverPublicAddress: string,
  userId: bigint,
  amount: string,
  source: "SWAP" | "BUY" | "SEND"
) => {
  try {
    switch (source) {
      case "SWAP":
      case "SEND":
        await sendBalance(
          fromWalletType,
          receiverPublicAddress,
          userId,
          amount
        );
        return;
      case "BUY":
        await incrementUserBalance(receiverPublicAddress, amount);
        return;
    }
  } catch (error) {
    throw error;
  }
};

const sendBalance = async (
  fromWalletType: WalletType,
  receiverPublicAddress: string,
  userId: bigint,
  amount: string
) => {
  await prisma.$transaction(async (tx) => {
    await decrementUserBalance(userId, amount, fromWalletType);
    const receiverResponse = await tx.user_wallet_details.findUnique({
      where: {
        wallet_address: receiverPublicAddress,
      },
    });
    if (!receiverResponse) {
      return;
    }
    incrementUserBalance(receiverPublicAddress, amount);
  });
};

const incrementUserBalance = async (
  receiverPublicAddress: string,
  amount: string
) => {
  await prisma.$transaction(async (tx) => {
    await tx.user_wallet_details.update({
      where: {
        wallet_address: receiverPublicAddress,
      },
      data: {
        wallet_balance: {
          increment: parseFloat(amount),
        },
      },
    });
  });
};

const decrementUserBalance = async (
  userId: bigint,
  amount: string,
  walletType: WalletType
) => {
  await prisma.$transaction(async (tx) => {
    await tx.user_wallet_details.update({
      where: {
        user_id_wallet_type: {
          user_id: userId,
          wallet_type: walletType,
        },
      },
      data: {
        wallet_balance: {
          decrement: parseFloat(amount),
        },
      },
    });
  });
};

export const getUserWalletBalance = async (
  walletType: WalletType,
  walletAddress: string
): Promise<number> => {
  try {
    const walletDetails = await prisma.user_wallet_details.findUnique({
      where: {
        wallet_address: walletAddress,
      },
    });
    if (!walletDetails) {
      return 0;
    }
    return walletDetails.wallet_balance;
  } catch (error) {
    return 0;
  }
};
