import { PrismaClient, user_state, wallet_type } from "@prisma/client";
import { User, Wallet, WalletQrType } from "../../types";
import { GeneratedWalletKeyPairsType } from "./utils";
import { generateReceiveQRCode } from "../../wallet-functions/receive";

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
  // addressType?: "PRIVATE" | "PUBLIC"
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
  wallets: GeneratedWalletKeyPairsType[],
  currentState: user_state,
  getNextState: (state: user_state) => user_state
) => {
  for (const wallet of wallets) {
    const createdWallet = await prisma.user_wallet_details.create({
      data: {
        user_id: userId,
        raw_user_id: rawUserId,
        wallet_address: wallet.keyPair.publicKey,
        wallet_private_key:
          typeof wallet.keyPair.privateKey === "string"
            ? wallet.keyPair.privateKey
            : JSON.stringify(wallet.keyPair.privateKey),
        wallet_type: wallet.walletType,
      },
    });

    const qr = await generateReceiveQRCode(
      wallet.keyPair.publicKey,
      wallet.walletType
    );

    if (qr.success && qr.qrCode) {
      await prisma.user_wallets_qr_codes.create({
        data: {
          wallet_id: createdWallet.row_id,
          qr_code_url: qr.qrCode,
        },
      });
    } else {
      console.log(
        `Failed to generate QR for wallet: ${wallet.keyPair.publicKey}`
      );
    }
  }

  await prisma.user_details.update({
    where: { user_id: rawUserId },
    data: { user_state: getNextState(currentState) },
  });
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
    wallet_address: item.user_wallet.wallet_address,
    wallet_type: item.user_wallet.wallet_type,
    qr_code_url: item.qr_code_url,
  }));
};
