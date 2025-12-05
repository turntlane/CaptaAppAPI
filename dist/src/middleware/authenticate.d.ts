import { Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
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
declare const authenticate: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export default authenticate;
