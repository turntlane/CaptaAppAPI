"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? '12');
const userSelect = {
    id: true,
    email: true,
    username: true,
    firstName: true,
    lastName: true,
    age: true,
    friendsCount: true,
    avatarUrl: true,
    isActive: true,
    role: true,
    createdAt: true,
    updatedAt: true,
};
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.user.findMany({
            select: userSelect,
        });
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: userSelect,
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async create(data, currentUserRole) {
        try {
            const user = await this.prisma.user.create({
                data,
                select: userSelect,
            });
            return user;
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.BadRequestException('Email or username already exists');
            }
            throw error;
        }
    }
    async update(id, data, currentUserRole) {
        try {
            const user = await this.prisma.user.update({
                where: { id },
                data,
                select: userSelect,
            });
            return user;
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException('User not found');
            }
            if (error.code === 'P2002') {
                throw new common_1.BadRequestException('Email or username already exists');
            }
            throw error;
        }
    }
    async remove(id) {
        try {
            await this.prisma.user.delete({
                where: { id },
            });
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException('User not found');
            }
            throw error;
        }
    }
    async prepareCreateData(dto, currentUserRole) {
        const passwordHash = await bcryptjs_1.default.hash(dto.password, SALT_ROUNDS);
        const data = {
            email: dto.email,
            username: dto.username,
            passwordHash,
            firstName: dto.firstName,
            lastName: dto.lastName,
            age: dto.age,
            avatarUrl: dto.avatarUrl,
        };
        if (dto.friendsCount !== undefined) {
            data.friendsCount = dto.friendsCount;
        }
        if (dto.isActive !== undefined && currentUserRole === client_1.Role.ADMIN) {
            data.isActive = dto.isActive;
        }
        if (dto.role !== undefined && currentUserRole === client_1.Role.ADMIN) {
            data.role = dto.role;
        }
        return data;
    }
    async prepareUpdateData(dto, currentUserRole) {
        const data = {};
        if (dto.email !== undefined)
            data.email = dto.email;
        if (dto.username !== undefined)
            data.username = dto.username;
        if (dto.firstName !== undefined)
            data.firstName = dto.firstName;
        if (dto.lastName !== undefined)
            data.lastName = dto.lastName;
        if (dto.age !== undefined)
            data.age = dto.age;
        if (dto.avatarUrl !== undefined)
            data.avatarUrl = dto.avatarUrl;
        if (dto.friendsCount !== undefined)
            data.friendsCount = dto.friendsCount;
        if (dto.isActive !== undefined && currentUserRole === client_1.Role.ADMIN) {
            data.isActive = dto.isActive;
        }
        if (dto.role !== undefined && currentUserRole === client_1.Role.ADMIN) {
            data.role = dto.role;
        }
        if (dto.password) {
            data.passwordHash = await bcryptjs_1.default.hash(dto.password, SALT_ROUNDS);
        }
        return data;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map