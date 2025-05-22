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
  receiverPublicKey: string,
  amountInSol: string,
  userId: bigint,
  senderPrivateKey?: string // stringified array like "[1,2,3,...]"
): Promise<{
  state: "SUCCESS" | "FAILURE";
  signature?: string;
}> => {
  if (!senderPrivateKey) {
    return { state: "FAILURE" };
  }
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );
  console.log("connection done");
  try {
    // Reconstruct sender keypair from private key
    const senderSecretKey = Uint8Array.from(JSON.parse(senderPrivateKey));
    console.log("secretKey");
    const senderKeypair = Keypair.fromSecretKey(senderSecretKey);
    console.log("keypair");
    const toPubKey = new PublicKey(receiverPublicKey);
    console.log("pbkey");
    console.log(amountInSol);
    const lamports = BigInt(Math.floor(Number(amountInSol) * LAMPORTS_PER_SOL));

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: toPubKey,
        lamports: lamports,
      })
    );
    console.log("tx");

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      senderKeypair,
    ]);
    console.log("Transaction Succesful");
    return {
      signature,
      state: "SUCCESS",
    };
  } catch (error) {
    console.log("Error sending SOL:", error);
    return {
      state: "FAILURE",
    };
  }
};
