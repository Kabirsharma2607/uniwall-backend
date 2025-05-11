import { Request, Response, Router } from "express";
import { middleware } from "../middleware";
import { PrismaClient } from "@prisma/client";
import { getAllBalances } from "../wallet/utils";
import { DashboardResponseSchema } from "../../types";
import { getActionItems, getWalletDetails } from "./utils";

const router = Router();

router.use(middleware);

const prisma = new PrismaClient();

router.get("/health", async (req: Request, res: Response) => {
  res.status(200).send("Hello world");
  return;
});

router.get("", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user_details.findUnique({
      where: {
        user_id: req.userId,
      },
    });
    if (!user) {
      res.status(401).send({
        success: false,
        message: "User not found",
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
      },
    });
    if (wallets.length === 0) {
      res.status(200).send({
        sucess: false,
        message: "You have not selected any wallets",
        deeplink: "/select-wallet",
      });
      return;
    }
    const availableWalletBalances = await getAllBalances(wallets);
    const actionItems = getActionItems(wallets.length);
    const walletDetails = getWalletDetails(availableWalletBalances);
    const response: DashboardResponseSchema = {
      username: user.username,
      actionItems,
      walletDetails,
    };
    res.status(200).send({
      success: true,
      message: "Successfully fetched user dashboard details",
      data: response,
    });
    return;
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
    return;
  }
});

export const dashboardRouter = router;

// wallet enable disable, action buttons enable disable state, balances
