import { GeneratedWalletType } from "../../types";
import { createSolanaWallet } from "../../wallet-functions/solana";
import { createEthereumWallet } from "../../wallet-functions/ethers";
import { createPolkadotWallet } from "../../wallet-functions/palo";
import { createBitcoinWallet } from "../../wallet-functions/bitcoin";
import { WalletType } from "@kabir.26/uniwall-commons";
import { wallet_type } from "@prisma/client";
import { getSolanaBalance } from "../../wallet-functions/solana";
import { getPolkadotBalance } from "../../wallet-functions/palo";
import { getBitcoinBalance } from "../../wallet-functions/bitcoin";
import { getEthereumBalance } from "../../wallet-functions/ethers";

type GeneratedWalletKeyPairsType = {
  walletType: WalletType;
  keyPair: GeneratedWalletType;
};

export type WalletBalanceType = {
  walletType: wallet_type;
  balance: string;
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

export const getAllBalances = async (
  wallets: {
    wallet_address: string;
    wallet_type: wallet_type;
  }[]
) => {
  const balances: WalletBalanceType[] = [];

  for (const wallet of wallets) {
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

export const availableWalletTypes: wallet_type[] = [
  wallet_type.SOL,
  wallet_type.ETH,
  wallet_type.PALO,
  wallet_type.BTC,
];

export const getNotSelectedWalletsList = (wallets: wallet_type[]) => {
  return availableWalletTypes.filter(
    (item) => !wallets.some((wallet) => wallet === item)
  );
};
