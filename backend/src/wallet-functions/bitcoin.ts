import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
import { ECPairFactory } from "ecpair";
import { GeneratedWalletType } from "../types";
import axios from "axios";

// Create ECPair instance with ecc
const ECPair = ECPairFactory(ecc);

export const createBitcoinWallet = (): GeneratedWalletType => {
  const keyPair = ECPair.makeRandom();

  // Ensure public key is a Node.js Buffer
  const publicKeyBuffer = Buffer.from(keyPair.publicKey);
  const { address } = bitcoin.payments.p2pkh({ pubkey: publicKeyBuffer });

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
  const res = await axios.get(`https://blockstream.info/api/address/${address}`);
  const funded = res.data.chain_stats.funded_txo_sum;
  const spent = res.data.chain_stats.spent_txo_sum;
  const balance = (funded - spent) / 1e8;
  return balance.toFixed(8);
};
