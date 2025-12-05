import { Request, Response, NextFunction } from "express";
declare const validateCreateUser: (req: Request, res: Response, next: NextFunction) => void;
declare const validateUpdateUser: (req: Request, res: Response, next: NextFunction) => void;
declare const validateRegister: (req: Request, res: Response, next: NextFunction) => void;
declare const validateLogin: (req: Request, res: Response, next: NextFunction) => void;
declare const validateRefresh: (req: Request, res: Response, next: NextFunction) => void;
export { validateCreateUser, validateUpdateUser, validateRegister, validateLogin, validateRefresh, };
