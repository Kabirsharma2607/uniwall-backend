import {Request, Response, Router} from "express"
import {middleware} from "../middleware"
import { createWallets } from "./utils";

const router = Router();

router.use(middleware);

router.get("/health", async(req: Request, res: Response) => {
    const response = createWallets(["SOL"]);

    res.status(200).json({data: response});
    return;
})

router.post("/select-wallet", async (req: Request, res: Response) => {
    try {
        
    } catch(e) {

    }
})

export const walletRouter = router;