<<<<<<< Updated upstream
import {Request, Response, Router} from "express"
import {middleware} from "../middleware"
=======
import { Request, Response, Router } from "express";
import { middleware } from "../middleware";
import { PrismaClient } from "@prisma/client";
import {
  availableWalletTypes,
  createWallets,
  getAllBalances,
  getNotSelectedWalletsList,
} from "./utils";
import { selectedWalletSchema } from "@kabir.26/uniwall-commons";
import { getUserNextState } from "../auth/utils";
>>>>>>> Stashed changes

const router = Router();

router.use(middleware);

<<<<<<< Updated upstream
router.get("/health", async(req: Request, res: Response) => {
    res.status(200).send("Ho gaya yaar");
    return;
})

export const walletRouter = router;
=======
router.get("/health", async (_: Request, res: Response) => {
  res.status(200).json({ message: "Health up" });
  return;
});

router.post("/select-wallet", async (req: Request, res: Response) => {
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
    const response = await createWallets(wallets);
    await prisma.user_wallet_details.createMany({
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
    await prisma.user_details.update({
      where: {
        user_id: req.userId,
      },
      data: {
        user_state: getUserNextState(user.user_state),
      },
    });
    res.status(200).json({
      success: true,
      message: "Wallets created successfully",
      deeplink: "/show-wallet",
    });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/get-eligible-wallets", async (req: Request, res: Response) => {
  try {
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

    const notSelectedWalletsList = getNotSelectedWalletsList(
      wallets.map((w) => w.wallet_type)
    );

    res.status(200).json({
      success: true,
      data: notSelectedWalletsList,
      message: "Eligible wallets fetched successfully",
    });

    return;
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/get-wallets", async (req: Request, res: Response) => {
  try {
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
        wallet_address: true,
        wallet_private_key: true,
      },
    });

    res.status(200).json({
      success: true,
      data: wallets,
      message: "Wallets fetched successfully",
      deeplink: "/dashboard",
    });

    return;
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
});

export const walletRouter = router;
>>>>>>> Stashed changes
