import { Request, Response, NextFunction } from "express";
import {
  loginUser,
  refreshSession,
  registerUser,
  revokeSession,
} from "../services/authService";

const extractMetadata = (req: Request) => ({
  ip: req.ip,
  userAgent: req.headers["user-agent"] ?? undefined,
});

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await registerUser(req.body, extractMetadata(req));
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await loginUser(req.body, extractMetadata(req));
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken || typeof refreshToken !== "string") {
      return res.status(400).json({ error: "refreshToken is required" });
    }

    const result = await refreshSession(refreshToken, extractMetadata(req));
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken || typeof refreshToken !== "string") {
      return res.status(400).json({ error: "refreshToken is required" });
    }

    await revokeSession(refreshToken);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
