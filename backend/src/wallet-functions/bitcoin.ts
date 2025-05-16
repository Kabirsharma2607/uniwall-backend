import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
import { ECPairFactory } from "ecpair";
import { GeneratedWalletType } from "../types";
import axios from "axios";
import { Prisma } from "@prisma/client";

// Create ECPair instance with ecc
const ECPair = ECPairFactory(ecc);

const testnet = bitcoin.networks.testnet;

export const createBitcoinWallet = (): GeneratedWalletType => {
  const keyPair = ECPair.makeRandom({ network: testnet });

  // Ensure public key is a Node.js Buffer
  const publicKeyBuffer = Buffer.from(keyPair.publicKey);
  const { address } = bitcoin.payments.p2pkh({ pubkey: publicKeyBuffer, network: testnet });

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
  const res = await axios.get(`https://blockstream.info/testnet/api/address/${address}`);
  const funded = res.data.chain_stats.funded_txo_sum;
  const spent = res.data.chain_stats.spent_txo_sum;
  const balanceInSatoshi = BigInt(funded) - BigInt(spent);
  const balance = Number(balanceInSatoshi) / 1e8;
  return balance.toFixed(8);
};

export const sendBitcoin = async (
  senderPrivateKey: string,
  receiverPublicKey: string,
  amountInBTC : number
) : Promise<string> => {
  return "Dummy Transaction Hash";
};