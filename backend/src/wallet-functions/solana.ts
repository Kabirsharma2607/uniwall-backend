import {
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
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
    console.log(publicKeyStr);
    const publicKey = new PublicKey(publicKeyStr);
    const balanceInLamports = await connection.getBalance(publicKey);
    const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL;
    return balanceInSol.toFixed(8);
  } catch (error) {
    console.log("Error fetching balance:", error);
    throw error;
  }
};

export const sendSolana = async (
  senderPrivateKey: string, // stringified array like "[1,2,3,...]"
  receiverPublicKey: string,
  amountInSol: number
): Promise<string> => {
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  try {
    // Reconstruct sender keypair from private key
    const senderSecretKey = Uint8Array.from(JSON.parse(senderPrivateKey));
    const senderKeypair = Keypair.fromSecretKey(senderSecretKey);
    const toPubKey = new PublicKey(receiverPublicKey);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: toPubKey,
        lamports: amountInSol * LAMPORTS_PER_SOL,
      })
    );

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [senderKeypair]
    );
    console.log("Transaction Succesful");
    return signature;
  } catch (error) {
    console.log("Error sending SOL:", error);
    throw error;
  }
};