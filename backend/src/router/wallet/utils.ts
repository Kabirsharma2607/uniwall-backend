import { GeneratedWalletType } from "../../types";
import { createSolanaWallet } from "../../wallet-functions/solana";
import { createEthereumWallet } from "../../wallet-functions/ethers";
import { createPolkadotWallet } from "../../wallet-functions/palo";
import { createBitcoinWallet } from "../../wallet-functions/bitcoin";
import { WalletType } from "@kabir.26/uniwall-commons";
import {PrismaClient, wallet_type } from "@prisma/client";
import { getSolanaBalance } from "../../wallet-functions/solana";
import { getPolkadotBalance } from "../../wallet-functions/palo";
import { getBitcoinBalance } from "../../wallet-functions/bitcoin";
import { getEthereumBalance } from "../../wallet-functions/ethers";

const prisma = new PrismaClient();

type GeneratedWalletKeyPairsType = {
  walletType: WalletType;
  keyPair: GeneratedWalletType;
};

type WalletBalanceType = {
  walletType: wallet_type;
  balance: number | string;
};

export const createWallets = async (requestedWallets: WalletType[]) => {
  const response: GeneratedWalletKeyPairsType[] = [];

  for (const wallet of requestedWallets) {
    switch (wallet) {
      case "SOL":
        response.push({ walletType: wallet, keyPair: createSolanaWallet() });
        break;
      case "ETH":
        response.push({ walletType: wallet, keyPair: createEthereumWallet() });
        break;
      case "PALO":
        response.push({
          walletType: wallet,
          keyPair: await createPolkadotWallet(),
        });
        break;
      case "BTC":
        response.push({ walletType: wallet, keyPair: createBitcoinWallet() });
        break;
    }
  }
  return response;
};

export const getAllBalances = async (userId?: string) => {
  const balances: WalletBalanceType[] = [];

  const user = await prisma.user_details.findUnique({
    where: {
      user_id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const userWallets = await prisma.user_wallet_details.findMany({
    where: {
      user_id: user.row_id,
    },
    select: {
      wallet_type: true,
      wallet_address: true,
    },
  });
  
  for (const wallet of userWallets) {
    const { wallet_type: type, wallet_address: address } = wallet;

    switch (type) {
      case wallet_type.SOL: {
        const balance = await getSolanaBalance(address);
        balances.push({ walletType: type, balance });
        break;
      }
      case wallet_type.PALO: {
        const balance = await getPolkadotBalance(address);
        balances.push({ walletType: type, balance });
        break;
      }
      case wallet_type.BTC: {
        const balance = await getBitcoinBalance(address);
        balances.push({ walletType: type, balance });
        break;
      }
      case wallet_type.ETH: {
        const balance = await getEthereumBalance(address);
        balances.push({ walletType: type, balance });
        break;
      }
    }
  }

  return balances;
};

export    const availableWalletTypes: wallet_type[] = [
      wallet_type.SOL,
      wallet_type.ETH,
      wallet_type.PALO,
      wallet_type.BTC,
    ];