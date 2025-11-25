import { Prisma, Role } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../models/database";

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? "12");

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

// Get all users
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: userSelect,
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Get user by ID
const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Create new user
const createUser = async (req: Request, res: Response) => {
  try {
    const {
      email,
      username,
      firstName,
      lastName,
      age,
      avatarUrl,
      password,
      friendsCount,
      isActive,
      role,
    } = req.body;

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const data: Prisma.UserCreateInput = {
      email,
      username,
      passwordHash,
      firstName,
      lastName,
      age,
      avatarUrl,
    };

    if (friendsCount !== undefined) data.friendsCount = friendsCount;
    if (isActive !== undefined && req.user?.role === Role.ADMIN) {
      data.isActive = isActive;
    }
    if (role !== undefined && req.user?.role === Role.ADMIN) {
      data.role = role;
    }

    const user = await prisma.user.create({
      data,
      select: userSelect,
    });

    res.status(201).json(user);
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(400).json({ error: "Email or username already exists" });
    } else {
      res.status(500).json({ error: "Failed to create user" });
    }
  }
};

// Update user
const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      email,
      username,
      firstName,
      lastName,
      age,
      avatarUrl,
      password,
      friendsCount,
      isActive,
      role,
    } = req.body;

    const passwordHash = password
      ? await bcrypt.hash(password, SALT_ROUNDS)
      : undefined;

    const data: Prisma.UserUpdateInput = {};
    if (email !== undefined) data.email = email;
    if (username !== undefined) data.username = username;
    if (firstName !== undefined) data.firstName = firstName;
    if (lastName !== undefined) data.lastName = lastName;
    if (age !== undefined) data.age = age;
    if (avatarUrl !== undefined) data.avatarUrl = avatarUrl;
    if (friendsCount !== undefined) data.friendsCount = friendsCount;
    if (isActive !== undefined && req.user?.role === Role.ADMIN) {
      data.isActive = isActive;
    }
    if (role !== undefined && req.user?.role === Role.ADMIN) {
      data.role = role;
    }
    if (passwordHash) data.passwordHash = passwordHash;

    const user = await prisma.user.update({
      where: { id },
      data,
      select: userSelect,
    });

    res.json(user);
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "User not found" });
    } else if (error.code === "P2002") {
      res.status(400).json({ error: "Email or username already exists" });
    } else {
      res.status(500).json({ error: "Failed to update user" });
    }
  }
};

// Delete user
const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
