import { Role } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
export interface AccessTokenPayload extends JwtPayload {
    sub: string;
    email: string;
    username: string;
    role: Role;
}
export declare const createAccessToken: (payload: AccessTokenPayload) => string;
export declare const verifyAccessToken: (token: string) => AccessTokenPayload;
export declare const hashToken: (token: string) => string;
export declare const generateRefreshToken: () => {
    token: string;
    tokenHash: string;
    expiresAt: Date;
};
export declare const tokenConfig: {
    accessTtl: string | number;
    refreshTtlDays: number;
};
