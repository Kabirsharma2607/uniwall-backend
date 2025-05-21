import { cryptoWaitReady, mnemonicGenerate } from "@polkadot/util-crypto";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import { GeneratedWalletType } from "../types";
import { updateWalletBalance } from "../router/wallet/db";

export const createPolkadotWallet = async (): Promise<GeneratedWalletType> => {
  await cryptoWaitReady();
  const mnemonic = mnemonicGenerate();
  const keyring = new Keyring({ type: "sr25519" });
  const pair = keyring.addFromUri(mnemonic);

  const response: GeneratedWalletType = {
    publicKey: pair.address,
    privateKey: mnemonic, // Store mnemonic to recover key
  };
  return response;
};

export const getPolkadotBalance = async (address: string): Promise<string> => {
  try {
    console.log("polka balance");
    const provider = new WsProvider("wss://rpc.polkadot.io");
    const api = await ApiPromise.create({ provider });

    const account = await api.query.system.account(address);
    const { data: balance } = account.toHuman() as unknown as {
      data: { free: string };
    };

    return balance.free;
  } catch (error) {
    console.log("Error fetching Polkadot balance:", error);
    throw error;
  }
};

export const sendPalo = async (
  receiverPublicKey: string,
  amountInPALO: string,
  userId: bigint
): Promise<{
  state: "SUCCESS" | "FAILURE";
  signature?: string;
}> => {
  try {
    await updateWalletBalance(
      "PALO",
      receiverPublicKey,
      userId,
      amountInPALO,
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
};
