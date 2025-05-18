import { Request, Response, Router } from "express";
import { middleware } from "../middleware";
import { PrismaClient, wallet_type } from "@prisma/client";
import {
  createWallets,
  getAllBalances,
  getNotSelectedWalletsList,
  getSelectedWalletBalance,
  getTransactionStatus,
  sendCoinFromOneWalletToAnother,
} from "./utils";
import {
  selectedWalletSchema,
  sendCoinSchema,
} from "@kabir.26/uniwall-commons";
import { getUserNextState } from "../auth/utils";
import Decimal from "decimal.js";
import {
  createUserWallets,
  getUser,
  getUserWalletQrCodes,
  getUserWallets,
  getWalletAddress,
} from "./db";
import { getWalletDetails } from "../dashboard/utils";
import { generateReceiveQRCode } from "../../wallet-functions/receive";

const router = Router();

router.use(middleware);

const prisma = new PrismaClient();

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

    const user = await getUser(req.userId);

    if (!user) {
      res.status(403).json({
        success: false,
        message: "User Not Found",
      });
      return;
    }

    const response = await createWallets(data.wallets);

    await createUserWallets(
      user.rowId,
      user.userId,
      response,
      user.userState,
      getUserNextState
    );

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
    const user = await getUser(req.userId);

    if (!user) {
      res.status(403).json({
        success: false,
        message: "User Not Found",
      });
      return;
    }

    const wallets = await prisma.user_wallet_details.findMany({
      where: {
        user_id: user.rowId,
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
    const user = await getUser(req.userId);

    const wallets = await getUserWallets(user.rowId);

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

router.get("/get-wallets-with-balance", async (req: Request, res: Response) => {
  try {
    console.log("someone called");
    const user = await getUser(req.userId);

    const wallets = await getUserWallets(user.rowId);

    const userBalances = await getAllBalances(
      wallets.map((wallet) => ({
        wallet_address: wallet.walletPublicAddress,
        wallet_type: wallet.walletType,
      }))
    );
    res.status(200).json({
      success: true,
      message: "User wallets balances successfully",
      // wallets,
      balances: userBalances,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
    return;
  }
});

router.post("/send-coin", async (req: Request, res: Response) => {
  try {
    console.log("called");

    const { success, error, data } = sendCoinSchema.safeParse(req.body);
    if (!success || error) {
      res.status(400).send({
        success: false,
        message: "Invalid body schema",
      });
      return;
    }
    console.log("called");
    const { amount, receiverPublicAddress, walletType } = data;
    const user = await getUser(req.userId);
    console.log("user");
    const userWalletAddress = await getWalletAddress(
      user.rowId,
      walletType
      // "PRIVATE"
    );
    console.log("user wallet", userWalletAddress);
    const selectedWalletBalance = await getSelectedWalletBalance(
      userWalletAddress.publicKey,
      walletType
    );
    console.log("user balance", selectedWalletBalance);
    if (new Decimal(selectedWalletBalance.balance).lt(new Decimal(amount))) {
      res.status(200).json({
        success: false,
        message: "Not sufficient funds",
      });
      return;
    }
    console.log("Sufficient balance");

    const transactionStatus = await sendCoinFromOneWalletToAnother(
      userWalletAddress.privateKey,
      walletType,
      receiverPublicAddress,
      amount
    );
    console.log("trans status", transactionStatus);
    res.status(200).send({
      success: true,
      message: getTransactionStatus(transactionStatus.state),
      signature: transactionStatus?.signature,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
    return;
  }
});

router.get("/receive-coins", async (req: Request, res: Response) => {
  try {
    const user = await getUser(req.userId);

    if (!user) {
      res.status(403).json({
        success: false,
        message: "User Not Found",
      });
      return;
    }

    const qrData = await getUserWalletQrCodes(user.rowId);

    res.status(200).json({
      success: true,
      wallets: qrData,
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

// send, to, amount,
