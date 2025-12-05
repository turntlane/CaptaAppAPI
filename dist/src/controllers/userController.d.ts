import { Request, Response } from "express";
declare const getAllUsers: (req: Request, res: Response) => Promise<void>;
declare const getUserById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const createUser: (req: Request, res: Response) => Promise<void>;
declare const updateUser: (req: Request, res: Response) => Promise<void>;
declare const deleteUser: (req: Request, res: Response) => Promise<void>;
export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
