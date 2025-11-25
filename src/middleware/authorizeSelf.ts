import { Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const authorizeSelf = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "User id parameter is required" });
  }

  if (id !== req.user.id && req.user.role !== Role.ADMIN) {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
};

export default authorizeSelf;
