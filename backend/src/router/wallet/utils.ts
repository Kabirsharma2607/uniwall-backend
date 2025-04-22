import { GeneratedWalletType } from "../../types";
import { createSolanaWallet } from "../../wallet-functions/solana";
import { createEthereumWallet } from "../../wallet-functions/ethers";
import { createPolkadotWallet } from "../../wallet-functions/palo";
import { createBitcoinWallet } from "../../wallet-functions/bitcoin";
import { WalletType } from "@kabir.26/uniwall-commons";

type GeneratedWalletKeyPairsType = {
    walletType: WalletType;
    keyPair: GeneratedWalletType;
};

export const createWallets = async (requestedWallets: WalletType[]) => {
    const response: GeneratedWalletKeyPairsType[] = [];

    for (const wallet of requestedWallets) {
        switch (wallet) {
            case "SOL":
                response.push({ walletType: wallet, keyPair: createSolanaWallet() });
                break;
            case "ETH":
                response.push({ walletType: wallet, keyPair: createEthereumWallet() });
                break;
            case "PALO":
                response.push({ walletType: wallet, keyPair: await createPolkadotWallet() });
                break;
            case "BTC":
                response.push({ walletType: wallet, keyPair: createBitcoinWallet() });
                break;
        }
    }
    console.log(response);
    return response;
};
