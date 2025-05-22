import { ethers } from "ethers";
import { GeneratedWalletType } from "../types";
import dotenv from "dotenv";
import { getUserWalletBalance, updateWalletBalance } from "../router/wallet/db";
dotenv.config();

// const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
// const provider = new AlchemyProvider("mainnet", ALCHEMY_API_KEY);

export const createEthereumWallet = (): GeneratedWalletType => {
  const wallet = ethers.Wallet.createRandom();
  const response: GeneratedWalletType = {
    publicKey: wallet.address,
    privateKey: wallet.privateKey,
  };
  return response;
};

export const getEthereumBalance = async (address: string): Promise<string> => {
  // const balance = await provider.getBalance(address);
  // return ethers.formatEther(balance); // returns balance in ETH
  const ethBalance = await getUserWalletBalance("ETH", address);
  console.log("ETH balance", ethBalance);
  return ethBalance.toFixed(8);
};

export const sendEther = async (
  receiverPublicKey: string,
  amountInETH: string,
  userId: bigint
): Promise<{
  state: "SUCCESS" | "FAILURE";
  signature?: string;
}> => {
  try {
    await updateWalletBalance(
      "ETH",
      receiverPublicKey,
      userId,
      amountInETH,
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
  // return { signature: "Dummy Transaction Hash", state: "SUCCESS" };
};

export const buyEther = async (
  receiverPublicKey: string,
  amountInETH: string,
  userId: bigint
): Promise<{
  state: "SUCCESS" | "FAILURE";
  signature?: string;
}> => {
  try {
    await updateWalletBalance(
      "ETH",
      receiverPublicKey,
      userId,
      amountInETH,
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
  // return { signature: "Dummy Transaction Hash", state: "SUCCESS" };
};
