import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcryptjs';

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
} as const;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: userSelect,
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(data: Prisma.UserCreateInput, currentUserRole?: Role) {
    try {
      const user = await this.prisma.user.create({
        data,
        select: userSelect,
      });
      return user;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email or username already exists');
      }
      throw error;
    }
  }

  async update(
    id: string,
    data: Prisma.UserUpdateInput,
    currentUserRole?: Role,
  ) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data,
        select: userSelect,
      });
      return user;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      if (error.code === 'P2002') {
        throw new BadRequestException('Email or username already exists');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  async prepareCreateData(
    dto: any,
    currentUserRole?: Role,
  ): Promise<Prisma.UserCreateInput> {
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const data: Prisma.UserCreateInput = {
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
    if (dto.isActive !== undefined && currentUserRole === Role.ADMIN) {
      data.isActive = dto.isActive;
    }
    if (dto.role !== undefined && currentUserRole === Role.ADMIN) {
      data.role = dto.role;
    }

    return data;
  }

  async prepareUpdateData(
    dto: any,
    currentUserRole?: Role,
  ): Promise<Prisma.UserUpdateInput> {
    const data: Prisma.UserUpdateInput = {};

    if (dto.email !== undefined) data.email = dto.email;
    if (dto.username !== undefined) data.username = dto.username;
    if (dto.firstName !== undefined) data.firstName = dto.firstName;
    if (dto.lastName !== undefined) data.lastName = dto.lastName;
    if (dto.age !== undefined) data.age = dto.age;
    if (dto.avatarUrl !== undefined) data.avatarUrl = dto.avatarUrl;
    if (dto.friendsCount !== undefined) data.friendsCount = dto.friendsCount;
    if (dto.isActive !== undefined && currentUserRole === Role.ADMIN) {
      data.isActive = dto.isActive;
    }
    if (dto.role !== undefined && currentUserRole === Role.ADMIN) {
      data.role = dto.role;
    }
    if (dto.password) {
      data.passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    }

    return data;
  }
}







