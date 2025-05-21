import { getSolanaBalance, sendSolana } from "../wallet-functions/solana";
import { buyEther, getEthereumBalance, sendEther } from "../wallet-functions/ethers";
import { buyPalo, getPolkadotBalance, sendPalo } from "../wallet-functions/palo";
import { buyBitcoin, getBitcoinBalance, sendBitcoin } from "../wallet-functions/bitcoin";
import { WalletType } from "@kabir.26/uniwall-commons";

/**
 * Function type to get balance from a blockchain address.
 */
type BalanceFetcher = (address: string) => Promise<string>;

/**
 * Function type to send tokens from one address to another.
 * Returns transaction hash or ID.
 */
type SendFunction = (
  to: string,
  amount: string,
  userId: bigint,
  from?: string,
) => Promise<{
  state: "SUCCESS" | "FAILURE";
  signature?: string;
}>;

/**
 * Wallet-specific balance fetchers.
 */
export const walletBalanceMap: Record<WalletType, BalanceFetcher> = {
  SOL: getSolanaBalance,
  ETH: getEthereumBalance,
  PALO: getPolkadotBalance,
  BTC: getBitcoinBalance,
};

/**
 * Wallet-specific send functions.
 */
export const walletSendMap: Record<WalletType, SendFunction> = {
  SOL: sendSolana,
  ETH: sendEther,
  PALO: sendPalo,
  BTC: sendBitcoin,
};


export const walletBuyMap: Record<WalletType, SendFunction> = {
  SOL: sendSolana,
  ETH: buyEther,
  PALO: buyPalo,
  BTC: buyBitcoin,
};