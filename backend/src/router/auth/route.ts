import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();

const prisma = new PrismaClient();

router.get("/login", (req, res) => {
  res.json({ message: "Login successful!" });
});

export const authRouter = router;
