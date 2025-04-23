import { cryptoWaitReady, mnemonicGenerate } from "@polkadot/util-crypto";
import { Keyring } from "@polkadot/keyring";
import { GeneratedWalletType } from "../types";

export const createPolkadotWallet = async (): Promise<GeneratedWalletType> => {
    await cryptoWaitReady();
    const mnemonic = mnemonicGenerate();
    const keyring = new Keyring({ type: 'sr25519' });
    const pair = keyring.addFromUri(mnemonic);

    const response: GeneratedWalletType = {
        publicKey: pair.address,
        privateKey: mnemonic // Store mnemonic to recover key
    };
    return response;
};
