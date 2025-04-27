import { ethers, AlchemyProvider } from "ethers";
import { GeneratedWalletType } from "../types";
import dotenv from "dotenv";
dotenv.config();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const provider = new AlchemyProvider('mainnet', ALCHEMY_API_KEY);


export const createEthereumWallet = (): GeneratedWalletType => {
  const wallet = ethers.Wallet.createRandom();
  const response: GeneratedWalletType = {
    publicKey: wallet.address,
    privateKey: wallet.privateKey,
  };
  return response;
};

export const getEthereumBalance = async (address: string): Promise<string> => {
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance); // returns balance in ETH
};