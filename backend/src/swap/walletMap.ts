import { wallet_type } from "@prisma/client";
import { getSolanaBalance, sendSolana } from "../wallet-functions/solana";
import { getEthereumBalance, sendEther } from "../wallet-functions/ethers";
import { getPolkadotBalance, sendPalo } from "../wallet-functions/palo";
import { getBitcoinBalance, sendBitcoin } from "../wallet-functions/bitcoin";

/**
 * Function type to get balance from a blockchain address.
 */
type BalanceFetcher = (address: string) => Promise<string>;

/**
 * Function type to send tokens from one address to another.
 * Returns transaction hash or ID.
 */
type SendFunction = (
  from: string,
  to: string,
  amount: number
) => Promise<string>;

/**
 * Wallet-specific balance fetchers.
 */
export const walletBalanceMap: Record<wallet_type, BalanceFetcher> = {
  SOL: getSolanaBalance,
  ETH: getEthereumBalance,
  PALO: getPolkadotBalance,
  BTC: getBitcoinBalance,
};

/**
 * Wallet-specific send functions.
 */
export const walletSendMap: Record<wallet_type, SendFunction> = {
  SOL: sendSolana,
  ETH: sendEther,
  PALO: sendPalo,
  BTC: sendBitcoin,
};
