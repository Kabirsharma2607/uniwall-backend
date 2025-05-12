import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
import { ECPairFactory } from "ecpair";
import axios from "axios";
import { GeneratedWalletType } from "../types"; // Make sure this type has 'publicKey' and 'privateKey' as strings

// Create ECPair instance using ECC
const ECPair = ECPairFactory(ecc);

// Use Bitcoin testnet
const testnet = bitcoin.networks.testnet;

export const createBitcoinWallet = (): GeneratedWalletType => {
  const keyPair = ECPair.makeRandom({ network: testnet });

  // Do NOT re-buffer the public key
  const { address } = bitcoin.payments.p2pkh({
    pubkey: Buffer.from(keyPair.publicKey as Uint8Array),
    network: testnet,
  });

  if (!address) {
    return {
      privateKey: "",
      publicKey: "",
    };
  }

  return {
    publicKey: address,
    privateKey: keyPair.toWIF(),
  };
};

export const getBitcoinBalance = async (address: string): Promise<string> => {
  const res = await axios.get(`https://blockstream.info/testnet/api/address/${address}`);
  const funded = res.data.chain_stats.funded_txo_sum;
  const spent = res.data.chain_stats.spent_txo_sum;
  const balance = (funded - spent) / 1e8;
  return balance.toFixed(8);
};

