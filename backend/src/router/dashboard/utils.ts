import { ActionItemSchema, WalletDetailsSchema } from "../../types";
import { getNotSelectedWalletsList, WalletBalanceType } from "../wallet/utils";

export const getActionItems = (
  availableWalletsLength: number
): ActionItemSchema[] => {
  const actionItems: ActionItemSchema[] = [
    {
      actionItemType: "SEND",
      isEnabled: true,
    },
    {
      actionItemType: "RECEIVE",
      isEnabled: true,
    },
    {
      actionItemType: "SWAP",
      isEnabled: availableWalletsLength > 1 ? true : false,
    },
    {
      actionItemType: "BUY",
      isEnabled: true,
    },
  ];
  return actionItems;
};

export const getWalletDetails = (
  availableWallets: WalletBalanceType[]
): WalletDetailsSchema[] => {
  const walletDetails: WalletDetailsSchema[] = [];
  const notSelectedWallets = getNotSelectedWalletsList(
    availableWallets.map((w) => w.walletType)
  );
  for (const wallet of availableWallets) {
    walletDetails.push({
      balance: wallet.balance,
      walletType: wallet.walletType,
      isEnabled: true,
    });
  }
  for (const wallet of notSelectedWallets) {
    walletDetails.push({
      balance: null,
      isEnabled: false,
      walletType: wallet,
    });
  }
  return walletDetails;
};
