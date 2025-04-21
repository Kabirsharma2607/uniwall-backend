import {Request, Response, Router} from "express"
import {middleware} from "../middleware"

const router = Router();

router.use(middleware);

router.get("/health", async(req: Request, res: Response) => {
    res.status(200).send("Ho gaya yaar");
    return;
})

router.post("/select-wallet", async (req: Request, res: Response) => {
    try {
        
    } catch(e) {

    }
})

export const walletRouter = router;