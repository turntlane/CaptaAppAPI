import { Request, Response, NextFunction } from "express";
declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export default requireAdmin;
