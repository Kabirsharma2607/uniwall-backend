import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import dayjs from "dayjs";

dotenv.config();

const saltRounds = Number(process.env.SALT_ROUNDS);

export const generateHash = async (data: string) => {
  const hashed = await bcrypt.hash(data, saltRounds);
  return hashed;
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};

const JWT_SECRET = process.env.JWT_SECRET || "default-wont-work";
const JWT_EXPIRY = 30 * 60;
export const generateAuthToken = (userId: string, username: string) => {
  return jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

export const generate24WordHash = () => {
  const wordLength = 4;
  const totalWords = 24;

  const generateWord = (): string => {
    return nanoid(wordLength);
  };

  return Array.from({ length: totalWords }, generateWord);
};

const isValidSecret = (secret: string[]): boolean => {
  return secret.every((word) => word.length === 4);
};

export const compareSecrets = (secretWord: string[], userOldSecret: string) => {
  if (!isValidSecret(secretWord)) return false;

  const userSecretArray = userOldSecret.split("-");
  if (!isValidSecret(userSecretArray)) return false;

  return JSON.stringify(secretWord) === JSON.stringify(userSecretArray);
};

export const canUpdatePassword = (lastUpdate: Date): boolean => {
  if (!lastUpdate) return true;

  const oneDayAgo = dayjs().subtract(1, "day");
  return dayjs(lastUpdate).isBefore(oneDayAgo);
};
