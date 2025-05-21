import { wallet_type } from "@prisma/client";
import { walletBuyMap, walletSendMap } from "./walletMap";
import { convertCurrency } from "./utils";
import { getAdminWithMinBalance } from "./adminWallet";
import { WalletType } from "@kabir.26/uniwall-commons";

type SwapTokenType = {
  userId: bigint;
  userPrivateKey: string; // stringified private key of user
  userWalletAddress: string;
  userTargetWallet: string | null;
  from: wallet_type;
  to: wallet_type;
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
  // Get admin wallet with enough `to` balance
  const admin = await getAdminWithMinBalance(to, convertedAmount);
  if (!admin) {
    console.log("Not enough admin balance");
    return;
  }

  const sendFromUser = walletSendMap[from];
  const sendFromAdmin = walletSendMap[to];

  // Step 1: User sends `amount` of `from` token to admin
  const sent = await sendFromUser(
    admin.wallet_address,
    amount.toString(),
    userId,
    userPrivateKey,
  );
  if (!sent) {
    console.log("Transfer from user to admin failed");
    return;
  }

  // Step 2: Admin sends `convertedAmount` of `to` token to user
  const sentBack = await sendFromAdmin(
    userTargetWallet,
    convertedAmount.toString(),
    userId,
    admin.private_key,
  );
  if (!sentBack) {
    console.log("Admin to user failed, refunding...");

    // Simulate refund (admin sends back the original amount to user)
    await sendFromAdmin(
      userWalletAddress,
      amount.toString(),
      userId,
      admin.private_key,
    );
    console.log("Refund done");
    return;
  }

  console.log(`Swap successful: ${amount} ${from} → ${convertedAmount} ${to}`);
};

export const buyCoins = async (
  userWalletAddress: string,
  userId: bigint,
  amount: number,
  walletType: WalletType
): Promise<"SUCCESS" | "FAILURE"> => {
  
  let admin;

  if (walletType == "SOL"){
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
    admin?.private_key,
  );

  return status.state;
};
