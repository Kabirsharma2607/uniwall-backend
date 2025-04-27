import { ethers } from "ethers";
import { GeneratedWalletType } from "../types";

export const createEthereumWallet = (): GeneratedWalletType => {
  const wallet = ethers.Wallet.createRandom();
  const response: GeneratedWalletType = {
    publicKey: wallet.address,
    privateKey: wallet.privateKey,
  };
  return response;
};

