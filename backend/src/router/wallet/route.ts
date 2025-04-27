import { Request, Response, Router } from "express";
import { middleware } from "../middleware";
import { PrismaClient, wallet_type } from "@prisma/client";
import { createWallets, getAllBalances } from "./utils";
import { selectedWalletSchema } from "@kabir.26/uniwall-commons";

const prisma = new PrismaClient();
const router = Router();

console.log("Entering Wallets");

router.use(middleware);


router.get("/health", async (req: Request, res: Response) => {
  const response = await getAllBalances(req.userId);
  res.status(200).json({ message: "Health up", data : response });
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

router.get("/get-eligible-wallets", async (req: Request, res: Response) => {
  console.log("Calling get-eligible-wallets");
  try {
    if (!req.userId) {
      res.status(400).json({
        success: false,
        message: "Invalid Request: Missing userId",
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

    const wallets = await prisma.user_wallet_details.findMany({
      where: {
        user_id: user.row_id,
      },
      select: {
        wallet_type: true,
      },
    });

    const allWalletTypes: wallet_type[] = [
      wallet_type.SOL,
      wallet_type.ETH,
      wallet_type.PALO,
      wallet_type.BTC,
    ];

    const existingWalletTypes = wallets.map(wallet => wallet.wallet_type);

    const missingWalletTypes = allWalletTypes.filter(
      type => !existingWalletTypes.includes(type)
    );

    res.status(200).json({
      success: true,
      data: missingWalletTypes,
      message: "Eligible wallets fetched successfully",
    });
    
    return;
  } catch (e) {
    console.error("Error in get-eligible-wallets:", e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export const walletRouter = router;