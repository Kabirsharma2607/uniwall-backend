import {
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { GeneratedWalletType } from "../types";

export const createSolanaWallet = (): GeneratedWalletType => {
  const wallet = Keypair.generate();
  const response: GeneratedWalletType = {
    publicKey: wallet.publicKey.toBase58(),
    privateKey: JSON.stringify(Array.from(wallet.secretKey)),
  };
  return response;
};

export const getSolanaBalance = async (
  publicKeyStr: string
): Promise<string> => {
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  try {
    const publicKey = new PublicKey(publicKeyStr);
    const balanceInLamports = await connection.getBalance(publicKey);
    const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL;
    return balanceInSol.toFixed(8);
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw error;
  }
};
