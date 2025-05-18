import { WalletType } from "@kabir.26/uniwall-commons";
import { user_state, wallet_type } from "@prisma/client";

export type GeneratedWalletType = {
  publicKey: string;
  privateKey: string;
};

export type WalletQrType = {
  wallet_address: string;
  wallet_type: wallet_type;
  qr_code_url: string;
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

export type User = {
  username: string;
  rowId: bigint;
  userId: string;
  userState: user_state;
  createdAt: Date;
  updatedAt: Date;
};

export type Wallet = {
  walletType: wallet_type;
  walletPublicAddress: string;
  walletPrivateKey: string;
};
