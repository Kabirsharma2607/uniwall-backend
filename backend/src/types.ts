import { WalletType } from "@kabir.26/uniwall-commons";

export type GeneratedWalletType = {
  publicKey: string;
  privateKey: string;
};

export type DashboardResponseSchema = {
  username: string;
  walletDetails: WalletDetailsSchema[];
  actionItems: ActionItemSchema[];
};

export type WalletDetailsSchema = {
  walletType: WalletType;
  isEnabled: boolean;
  balance: string | null;
};

export type ActionItemSchema = {
  actionItemType: "SEND" | "RECEIVE" | "SWAP" | "BUY";
  isEnabled: boolean;
};
