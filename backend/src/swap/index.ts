import { wallet_type } from "@prisma/client";
import { walletSendMap } from "./walletMap";
import { convertCurrency } from "./utils";
import { getAdminWithMinBalance } from "./adminWallet";

type SwapTokenType = {
  userPrivateKey: string; // stringified private key of user
  userWalletAddress: string;
  userTargetWallet: string | null;
  from: wallet_type;
  to: wallet_type;
  amount: number;
};

export async function swapToken({
  userPrivateKey,
  userWalletAddress,
  userTargetWallet,
  from,
  to,
  amount,
}: SwapTokenType) {
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
  const sent = await sendFromUser(userPrivateKey, admin.wallet_address, amount);
  if (!sent) {
    console.log("Transfer from user to admin failed");
    return;
  }

  // Step 2: Admin sends `convertedAmount` of `to` token to user
  const sentBack = await sendFromAdmin(
    admin.private_key,
    userTargetWallet,
    convertedAmount
  );
  if (!sentBack) {
    console.log("Admin to user failed, refunding...");

    // Simulate refund (admin sends back the original amount to user)
    await sendFromAdmin(admin.private_key, userWalletAddress, amount);
    console.log("Refund done");
    return;
  }

  console.log(`Swap successful: ${amount} ${from} → ${convertedAmount} ${to}`);
}
