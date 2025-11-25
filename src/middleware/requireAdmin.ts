import { Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (req.user.role !== Role.ADMIN) {
    return res.status(403).json({ error: "Admin privileges required" });
  }

  next();
};

export default requireAdmin;
