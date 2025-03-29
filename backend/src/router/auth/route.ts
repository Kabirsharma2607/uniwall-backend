import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();

const prisma = new PrismaClient();

router.get("/login", async (req: Request, res: Response) => {
  res.json({ message: "Login successful!" });
});

router.post("/signup", (req: Request, res: Response) => {
  const { body } = req;
});

export const authRouter = router;
