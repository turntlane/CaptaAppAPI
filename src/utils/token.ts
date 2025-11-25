import crypto from "crypto";
import { Role } from "@prisma/client";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import HttpError from "./httpError";

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  email: string;
  username: string;
  role: Role;
}

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const parseAccessTtl = (): string | number => getEnv("JWT_ACCESS_TTL", "15m");

const refreshTtlDays = (): number => {
  const ttl = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? "7");
  if (Number.isNaN(ttl) || ttl <= 0) {
    throw new Error("REFRESH_TOKEN_TTL_DAYS must be a positive number");
  }
  return ttl;
};

export const createAccessToken = (payload: AccessTokenPayload): string => {
  const secret = getEnv("JWT_ACCESS_SECRET");
  const options: SignOptions = {
    expiresIn: parseAccessTtl() as unknown as SignOptions["expiresIn"],
  };
  return jwt.sign(payload as object, secret, options);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  try {
    const secret = getEnv("JWT_ACCESS_SECRET");
    return jwt.verify(token, secret) as AccessTokenPayload;
  } catch {
    throw new HttpError(401, "Invalid or expired token");
  }
};

export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const generateRefreshToken = () => {
  const token = crypto.randomBytes(64).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(
    Date.now() + refreshTtlDays() * 24 * 60 * 60 * 1000
  );

  return { token, tokenHash, expiresAt };
};

export const tokenConfig = {
  accessTtl: parseAccessTtl(),
  refreshTtlDays: refreshTtlDays(),
};
