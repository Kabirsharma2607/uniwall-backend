import { Router } from "express";
import { authRouter } from "./auth/route";
import { walletRouter } from "./wallet/route";

const router = Router();

router.use("/auth", authRouter);

router.use("/wallet", walletRouter);

export const appRouter = router;
