import { Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      username: string;
      role: Role;
    }

    interface Request {
      user?: User;
    }
  }
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const token = authHeader.slice(7).trim();

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
      role: payload.role,
    };
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
