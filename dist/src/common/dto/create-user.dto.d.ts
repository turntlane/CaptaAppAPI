import { Role } from '@prisma/client';
export declare class CreateUserDto {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    age: number;
    avatarUrl?: string;
    friendsCount?: number;
    isActive?: boolean;
    role?: Role;
}
