import { GeneratedWalletType } from "../../types";
import {createSolanaWallet} from "../../wallet-functions/solana"
import {WalletType} from "@kabir.26/uniwall-commons"

type GeneratedWalletKeyPairsType =  {
    walletType : WalletType;
    keyPair : GeneratedWalletType;
}

export const createWallets = async (requestedWallets: WalletType[]) => {
    const response : GeneratedWalletKeyPairsType[] = [];
    for (const wallet of requestedWallets){
        switch (wallet){
            case "SOL":
                response.push({walletType: wallet, keyPair: createSolanaWallet()});
        }
    }
};
