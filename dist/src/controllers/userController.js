"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("../models/database"));
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
};
const getAllUsers = async (req, res) => {
    try {
        const users = await database_1.default.user.findMany({
            select: userSelect,
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await database_1.default.user.findUnique({
            where: { id },
            select: userSelect,
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    try {
        const { email, username, firstName, lastName, age, avatarUrl, password, friendsCount, isActive, role, } = req.body;
        const passwordHash = await bcryptjs_1.default.hash(password, SALT_ROUNDS);
        const data = {
            email,
            username,
            passwordHash,
            firstName,
            lastName,
            age,
            avatarUrl,
        };
        if (friendsCount !== undefined)
            data.friendsCount = friendsCount;
        if (isActive !== undefined && req.user?.role === client_1.Role.ADMIN) {
            data.isActive = isActive;
        }
        if (role !== undefined && req.user?.role === client_1.Role.ADMIN) {
            data.role = role;
        }
        const user = await database_1.default.user.create({
            data,
            select: userSelect,
        });
        res.status(201).json(user);
    }
    catch (error) {
        if (error.code === "P2002") {
            res.status(400).json({ error: "Email or username already exists" });
        }
        else {
            res.status(500).json({ error: "Failed to create user" });
        }
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, username, firstName, lastName, age, avatarUrl, password, friendsCount, isActive, role, } = req.body;
        const passwordHash = password
            ? await bcryptjs_1.default.hash(password, SALT_ROUNDS)
            : undefined;
        const data = {};
        if (email !== undefined)
            data.email = email;
        if (username !== undefined)
            data.username = username;
        if (firstName !== undefined)
            data.firstName = firstName;
        if (lastName !== undefined)
            data.lastName = lastName;
        if (age !== undefined)
            data.age = age;
        if (avatarUrl !== undefined)
            data.avatarUrl = avatarUrl;
        if (friendsCount !== undefined)
            data.friendsCount = friendsCount;
        if (isActive !== undefined && req.user?.role === client_1.Role.ADMIN) {
            data.isActive = isActive;
        }
        if (role !== undefined && req.user?.role === client_1.Role.ADMIN) {
            data.role = role;
        }
        if (passwordHash)
            data.passwordHash = passwordHash;
        const user = await database_1.default.user.update({
            where: { id },
            data,
            select: userSelect,
        });
        res.json(user);
    }
    catch (error) {
        if (error.code === "P2025") {
            res.status(404).json({ error: "User not found" });
        }
        else if (error.code === "P2002") {
            res.status(400).json({ error: "Email or username already exists" });
        }
        else {
            res.status(500).json({ error: "Failed to update user" });
        }
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.user.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (error) {
        if (error.code === "P2025") {
            res.status(404).json({ error: "User not found" });
        }
        else {
            res.status(500).json({ error: "Failed to delete user" });
        }
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map