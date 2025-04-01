import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

import {
  authSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@kabir.26/uniwall-commons";
import {
  canUpdatePassword,
  comparePasswords,
  compareSecrets,
  generate24WordHash,
  generateAuthToken,
  generateHash,
} from "./utils";

const router = Router();

const prisma = new PrismaClient();

router.get("/login", async (req: Request, res: Response) => {
  try {
    const { success, data } = authSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: "Invalid request body" });
      return;
    }
    const { username, password } = data;

    const user = await prisma.user_details.findUnique({
      where: { username },
      include: {
        user_auth_details: true,
      },
    });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const isPasswordValid = await comparePasswords(
      password,
      user.user_auth_details?.password!
    );
    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }
    const token = generateAuthToken(user.user_id, username);
    res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      token: token,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
    return;
  }
});

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { success, data, error } = authSchema.safeParse(req.body);
    if (error || !success) {
      res.status(400).json({
        success: false,
        message: "Invalid body",
      });
      return;
    }
    const { username, password } = data;

    const existingUser = await prisma.user_details.findUnique({
      where: {
        username: username,
      },
    });

    if (existingUser) {
      res.status(404).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await generateHash(password);

    const secretWord = generate24WordHash();

    const newUser = await prisma.user_details.create({
      data: {
        username,
        user_auth_details: {
          create: {
            password: hashedPassword,
            words_secret: secretWord.join("-"),
          },
        },
      },
    });
    if (newUser) {
      const authToken = generateAuthToken(newUser.user_id, username);
      res.status(200).json({
        success: true,
        message: "User signed up successfully",
        wordsSecret: secretWord,
        token: authToken,
      });
      return;
    } else {
      res.status(400).json({
        success: false,
        message: "Some error occured",
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
});

router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    await prisma.$transaction(async (tx) => {
      const { success, data, error } = forgotPasswordSchema.safeParse(req.body);
      if (!success || error) {
        res.status(400).json({
          success: false,
          message: "Invalid request body",
        });
        return;
      }
      const { username, secretWord, newPassword } = data;
      const user = await prisma.user_details.findUnique({
        where: {
          username,
        },
        include: {
          user_auth_details: true,
        },
      });
      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }
      const updatePasswordAllowed = canUpdatePassword(
        user?.user_auth_details?.created_at!
      );
      if (!updatePasswordAllowed) {
        res.status(401).json({
          success: false,
          message: "Password update is not allowed at this time",
        });
        return;
      }
      const isSecretValid = compareSecrets(
        secretWord,
        user.user_auth_details?.words_secret!
      );
      if (!isSecretValid) {
        res.status(404).json({
          success: false,
          message: "Invalid Secret",
        });
        return;
      }
      const hashedPassword = await generateHash(newPassword);
      await tx.user_auth_details.delete({
        where: {
          user_id: user.user_id,
        },
      });
      const newSecretWord = generate24WordHash();
      await tx.user_auth_details.create({
        data: {
          password: hashedPassword,
          user_id: user.user_id,
          words_secret: newSecretWord.join("-"),
        },
      });
      const authToken = generateAuthToken(user.user_id, username);
      res.status(200).json({
        success: true,
        message: "Password reset successfully",
        wordsSecret: newSecretWord,
        token: authToken,
      });
      return;
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
});

router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    await prisma.$transaction(async (tx) => {
      const { success, data, error } = resetPasswordSchema.safeParse(req.body);
      if (!success || error) {
        res.status(400).json({
          success: false,
          message: "Invalid request body",
        });
        return;
      }
      const { username, oldPassword, newPassword, secretWord } = data;

      const user = await prisma.user_details.findUnique({
        where: {
          user_id: username,
        },
        include: {
          user_auth_details: true,
        },
      });
      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }
      const updatePasswordAllowed = canUpdatePassword(
        user?.user_auth_details?.created_at!
      );
      if (!updatePasswordAllowed) {
        res.status(401).json({
          success: false,
          message: "Password update is not allowed at this time",
        });
        return;
      }
      const isPasswordValid = await comparePasswords(
        oldPassword,
        user.user_auth_details?.password!
      );
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: "Invalid old password",
        });
        return;
      }
      const isSecretValid = compareSecrets(
        secretWord,
        user.user_auth_details?.words_secret!
      );
      if (!isSecretValid) {
        res.status(404).json({
          success: false,
          message: "Invalid Secret",
        });
        return;
      }
      const hashedPassword = await generateHash(newPassword);
      await tx.user_auth_details.delete({
        where: {
          user_id: user.user_id,
        },
      });
      const newSecretWord = generate24WordHash();
      await tx.user_auth_details.create({
        data: {
          password: hashedPassword,
          user_id: user.user_id,
          words_secret: newSecretWord.join("-"),
        },
      });
      const authToken = generateAuthToken(user.user_id, username);
      res.status(200).json({
        success: true,
        message: "Password reset successfully",
        wordsSecret: newSecretWord,
        token: authToken,
      });
      return;
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
});

export const authRouter = router;
