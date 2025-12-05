import { UsersService } from './users.service';
import { CreateUserDto } from '../common/dto/create-user.dto';
import { UpdateUserDto } from '../common/dto/update-user.dto';
import { UserPayload } from '../common/decorators/user.decorator';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    create(createUserDto: CreateUserDto, user: UserPayload): Promise<{
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
    update(id: string, updateUserDto: UpdateUserDto, user: UserPayload): Promise<{
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
}
