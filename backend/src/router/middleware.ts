import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { user_state } from "@prisma/client";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET ?? "";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      username?: string;
    }
  }
}

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header || header.split(" ")[0] !== "Bearer") {
      res.status(401).json({
        success: false,
        message: "Token Not Found",
      });
      return;
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      username: string;
      userState: user_state;
    };
    req.userId = decoded.userId;
    req.username = decoded.username;

    next();
    return;
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
    return;
  }
};
