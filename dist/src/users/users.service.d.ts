import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        age: number;
        friendsCount: number;
        avatarUrl: string;
        isActive: boolean;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        age: number;
        friendsCount: number;
        avatarUrl: string;
        isActive: boolean;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(data: Prisma.UserCreateInput, currentUserRole?: Role): Promise<{
        id: string;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        age: number;
        friendsCount: number;
        avatarUrl: string;
        isActive: boolean;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: Prisma.UserUpdateInput, currentUserRole?: Role): Promise<{
        id: string;
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        age: number;
        friendsCount: number;
        avatarUrl: string;
        isActive: boolean;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<void>;
    prepareCreateData(dto: any, currentUserRole?: Role): Promise<Prisma.UserCreateInput>;
    prepareUpdateData(dto: any, currentUserRole?: Role): Promise<Prisma.UserUpdateInput>;
}
