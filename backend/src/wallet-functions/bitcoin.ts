import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
import { ECPairFactory } from "ecpair";
import { GeneratedWalletType } from "../types";
import { getUserWalletBalance, updateWalletBalance } from "../router/wallet/db";

// Create ECPair instance with ecc
const ECPair = ECPairFactory(ecc);

const testnet = bitcoin.networks.testnet;

export const createBitcoinWallet = (): GeneratedWalletType => {
  const keyPair = ECPair.makeRandom({ network: testnet });

  // Ensure public key is a Node.js Buffer
  const publicKeyBuffer = Buffer.from(keyPair.publicKey);
  const { address } = bitcoin.payments.p2pkh({
    pubkey: publicKeyBuffer,
    network: testnet,
  });

  if (!address) {
    return {
      privateKey: "",
      publicKey: "",
    };
  }

  const response: GeneratedWalletType = {
    publicKey: address,
    privateKey: keyPair.toWIF(),
  };
  return response;
};

export const getBitcoinBalance = async (address: string): Promise<string> => {
  // const res = await axios.get(
  //   `https://blockstream.info/testnet/api/address/${address}`
  // );
  // const funded = res.data.chain_stats.funded_txo_sum;
  // const spent = res.data.chain_stats.spent_txo_sum;
  // const balanceInSatoshi = BigInt(funded) - BigInt(spent);
  // const balance = Number(balanceInSatoshi) / 1e8;
  // return balance.toFixed(8);
  const btcBalance = await getUserWalletBalance("BTC", address);
  return btcBalance.toFixed(8);
};

export const sendBitcoin = async (
  receiverPublicKey: string,
  amountInBTC: string,
  userId: bigint
): Promise<{
  state: "SUCCESS" | "FAILURE";
  signature?: string;
}> => {
  try {
    await updateWalletBalance(
      "BTC",
      receiverPublicKey,
      userId,
      amountInBTC,
      "SEND"
    );
    return {
      signature: "",
      state: "SUCCESS",
    };
  } catch (error) {
    return {
      state: "FAILURE",
    };
  }
};

export const buyBitcoin = async (
  receiverPublicKey: string,
  amountInBTC: string,
  userId: bigint
): Promise<{
  state: "SUCCESS" | "FAILURE";
  signature?: string;
}> => {
  try {
    await updateWalletBalance(
      "BTC",
      receiverPublicKey,
      userId,
      amountInBTC,
      "BUY"
    );
    return {
      signature: "",
      state: "SUCCESS",
    };
  } catch (error) {
    return {
      state: "FAILURE",
    };
  }
};
