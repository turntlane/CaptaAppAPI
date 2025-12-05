import { Request, Response, NextFunction } from "express";
declare const loginRateLimiter: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export default loginRateLimiter;
