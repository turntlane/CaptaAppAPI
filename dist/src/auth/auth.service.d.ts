import { PrismaService } from '../prisma/prisma.service';
interface RegisterInput {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    age: number;
    avatarUrl?: string;
    friendsCount?: number;
}
interface LoginInput {
    email: string;
    password: string;
}
interface SessionMetadata {
    ip?: string;
    userAgent?: string;
}
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
    private issueSession;
    registerUser(input: RegisterInput, metadata: SessionMetadata): Promise<{
        user: Omit<{
            id: string;
            email: string;
            username: string;
            passwordHash: string;
            firstName: string;
            lastName: string;
            age: number;
            friendsCount: number;
            avatarUrl: string | null;
            isActive: boolean;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        }, "passwordHash">;
        accessToken: string;
        refreshToken: string;
        accessTokenExpiresIn: string | number;
        refreshTokenExpiresAt: string;
    }>;
    loginUser(input: LoginInput, metadata: SessionMetadata): Promise<{
        user: Omit<{
            id: string;
            email: string;
            username: string;
            passwordHash: string;
            firstName: string;
            lastName: string;
            age: number;
            friendsCount: number;
            avatarUrl: string | null;
            isActive: boolean;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        }, "passwordHash">;
        accessToken: string;
        refreshToken: string;
        accessTokenExpiresIn: string | number;
        refreshTokenExpiresAt: string;
    }>;
    refreshSession(refreshToken: string, metadata: SessionMetadata): Promise<{
        user: Omit<{
            id: string;
            email: string;
            username: string;
            passwordHash: string;
            firstName: string;
            lastName: string;
            age: number;
            friendsCount: number;
            avatarUrl: string | null;
            isActive: boolean;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        }, "passwordHash">;
        accessToken: string;
        refreshToken: string;
        accessTokenExpiresIn: string | number;
        refreshTokenExpiresAt: string;
    }>;
    revokeSession(refreshToken: string): Promise<void>;
}
export {};
