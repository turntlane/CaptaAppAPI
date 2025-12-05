import { AuthService } from './auth.service';
import { RegisterDto } from '../common/dto/register.dto';
import { LoginDto } from '../common/dto/login.dto';
import { RefreshDto } from '../common/dto/refresh.dto';
import { RequestMetadata } from '../common/decorators/metadata.decorator';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto, metadata: RequestMetadata): Promise<{
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
    login(loginDto: LoginDto, metadata: RequestMetadata): Promise<{
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
    refresh(refreshDto: RefreshDto, metadata: RequestMetadata): Promise<{
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
    logout(refreshDto: RefreshDto): Promise<void>;
}
