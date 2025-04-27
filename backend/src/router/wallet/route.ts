import { Request, Response, Router } from "express";
import { middleware } from "../middleware";
import { PrismaClient } from "@prisma/client";
import { createWallets } from "./utils";
import { selectedWalletSchema } from "@kabir.26/uniwall-commons";
import { getSolanaBalance } from "../../wallet-functions/solana";
import { getPolkadotBalance } from "../../wallet-functions/palo";
import { getBitcoinBalance } from "../../wallet-functions/bitcoin";
const prisma = new PrismaClient();
const router = Router();

console.log("Entering Wallets");

router.use(middleware);


router.get("/health", (req: Request, res: Response) => {
  // const response = await getBitcoinBalance(
  //   "15wJKjr1QYCd4gJAsNQo8LGiGWk9sA5ruj"
  // );
  res.status(200).json({ message: "Health up" });
  return; 
});

router.post("/select-wallet", async (req: Request, res: Response) => {
  console.log("Calling select-wallet");
  try {
    const { success, data } = selectedWalletSchema.safeParse(req.body);

    if (!success || data.wallets.length === 0) {
      res.status(400).json({
        success: false,
        message: "Invalid Request",
      });
      return;
    }

    const user = await prisma.user_details.findUnique({
      where: {
        user_id: req.userId,
      },
    });

    if (!user) {
      res.status(403).json({
        success: false,
        message: "User Not Found",
      });
      return;
    }

    const { wallets } = data;
    console.log(wallets);
    const response = await createWallets(wallets);
    console.log(response);
    const createdWallets = await prisma.user_wallet_details.createMany({
      data: response.map((wallet) => ({
        user_id: user.row_id,
        raw_user_id: user.user_id,
        wallet_address: wallet.keyPair.publicKey,
        wallet_private_key:
          typeof wallet.keyPair.privateKey === "string"
            ? wallet.keyPair.privateKey
            : JSON.stringify(wallet.keyPair.privateKey),
        wallet_type: wallet.walletType,
      })),
    });
    console.log("DB Updated");
    res.status(200).json({
      success: true,
      data: response,
      message: "Wallets created successfully",
    });
    return;
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export const walletRouter = router;
