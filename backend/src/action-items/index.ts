import { walletBuyMap, walletSendMap } from "./walletMap";
import { convertCurrency } from "./utils";
import { getAdminWithMinBalance } from "./adminWallet";
import { WalletType } from "@kabir.26/uniwall-commons";
import {
  decrementUserBalance,
  incrementUserBalance,
} from "../router/wallet/db";

type SwapTokenType = {
  userId: bigint;
  userPrivateKey: string; // stringified private key of user
  userWalletAddress: string;
  userTargetWallet: string | null;
  from: WalletType;
  to: WalletType;
  amount: number;
};

export const swapToken = async ({
  userPrivateKey,
  userWalletAddress,
  userTargetWallet,
  from,
  to,
  amount,
  userId,
}: SwapTokenType) => {
  if (!userTargetWallet) {
    console.log(`User has no ${to} wallet, ask to create`);
    return;
  }

  // Convert amount from `from` to equivalent in `to`
  const convertedAmount = await convertCurrency(amount, from, to);

  const sendFromUser = walletSendMap[from];
  const sendFromAdmin = walletSendMap[to];

  // Get admin wallet with enough `to` balance
  if (to == "SOL") {
    const admin = await getAdminWithMinBalance(to, convertedAmount);
    if (!admin) {
      console.log("Not enough admin balance");
      return false;
    }
    console.log(admin);
    await decrementUserBalance(userId, amount.toString(), from);

    const sent = await sendFromAdmin(
      userTargetWallet,
      convertedAmount.toString(),
      userId,
      admin.private_key
    );

    if (sent.state === "FAILURE") {
      console.log("Transfer from user to admin failed");
      await incrementUserBalance(userWalletAddress, amount.toString());
      return false;
    }
    console.log(
      `Swap successful: ${amount} ${from} → ${convertedAmount} ${to}`
    );
    return true;
  } else if (from == "SOL") {
    const admin = await getAdminWithMinBalance(from, 0);
    if (!admin) {
      console.log("Not enough admin balance");
      return false;
    }
    const sent = await sendFromUser(
      admin.wallet_address,
      amount.toString(),
      userId,
      userPrivateKey
    );

    if (sent.state === "FAILURE") {
      console.log("Transfer from user to admin failed");
      return false;
    }

    await incrementUserBalance(userTargetWallet, convertedAmount.toString());
    console.log(
      `Swap successful: ${amount} ${from} → ${convertedAmount} ${to}`
    );
    return true;
  } else {
    console.log("Entered swap");
    await decrementUserBalance(userId, amount.toString(), from);
    console.log("decremented", userTargetWallet);
    await incrementUserBalance(userTargetWallet, convertedAmount.toString());
    console.log("incremented");
    return true;
  }
};

export const buyCoins = async (
  userWalletAddress: string,
  userId: bigint,
  amount: number,
  walletType: WalletType
): Promise<"SUCCESS" | "FAILURE"> => {
  let admin;

  if (walletType == "SOL") {
    admin = await getAdminWithMinBalance(walletType, amount);
    if (!admin) {
      console.log("Not enough admin balance");
      return "FAILURE";
    }
  }

  const buyFrom = walletBuyMap[walletType];

  const status = await buyFrom(
    userWalletAddress,
    amount.toString(),
    userId,
    admin?.private_key
  );

  return status.state;
};
