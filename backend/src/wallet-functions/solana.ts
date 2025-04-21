import {Keypair} from "@solana/web3.js"
import { GeneratedWalletType } from "../types";

export const createSolanaWallet = () : GeneratedWalletType => {
        const wallet = Keypair.generate();
        
        const response : GeneratedWalletType = {
            publicKey: wallet.publicKey.toBase58(),
            privateKey: Array.from(wallet.secretKey)
        }

        return response;

} 

