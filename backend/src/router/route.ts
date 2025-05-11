import { Router } from "express";
import { authRouter } from "./auth/route";
import { walletRouter } from "./wallet/route";
import { dashboardRouter } from "./dashboard/route";

const router = Router();

router.use("/auth", authRouter);

router.use("/wallet", walletRouter);

router.use("/dashboard", dashboardRouter);

export const appRouter = router;
