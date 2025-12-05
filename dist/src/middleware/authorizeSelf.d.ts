import { Request, Response, NextFunction } from "express";
declare const authorizeSelf: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export default authorizeSelf;
