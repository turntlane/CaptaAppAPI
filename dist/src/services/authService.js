"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeSession = exports.refreshSession = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../models/database"));
const httpError_1 = __importDefault(require("../utils/httpError"));
const token_1 = require("../utils/token");
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? "12");
const sanitizeUser = (user) => {
    const { passwordHash, ...rest } = user;
    return rest;
};
const buildAccessPayload = (user) => ({
    sub: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
});
const issueSession = async (userId, metadata, tx = database_1.default) => {
    const { token, tokenHash, expiresAt } = (0, token_1.generateRefreshToken)();
    const refreshRecord = await tx.refreshToken.create({
        data: {
            tokenHash,
            userId,
            expiresAt,
            ipAddress: metadata.ip,
            userAgent: metadata.userAgent,
        },
    });
    return { token, refreshRecord };
};
const registerUser = async (input, metadata) => {
    const existing = await database_1.default.user.findFirst({
        where: {
            OR: [{ email: input.email }, { username: input.username }],
        },
    });
    if (existing) {
        throw new httpError_1.default(409, "Email or username already exists");
    }
    const passwordHash = await bcryptjs_1.default.hash(input.password, SALT_ROUNDS);
    const user = await database_1.default.user.create({
        data: {
            email: input.email,
            username: input.username,
            passwordHash,
            firstName: input.firstName,
            lastName: input.lastName,
            age: input.age,
            avatarUrl: input.avatarUrl,
            friendsCount: input.friendsCount,
            role: client_1.Role.USER,
        },
    });
    const { token, refreshRecord } = await issueSession(user.id, metadata);
    const accessToken = (0, token_1.createAccessToken)(buildAccessPayload(user));
    return {
        user: sanitizeUser(user),
        accessToken,
        refreshToken: token,
        accessTokenExpiresIn: token_1.tokenConfig.accessTtl,
        refreshTokenExpiresAt: refreshRecord.expiresAt.toISOString(),
    };
};
exports.registerUser = registerUser;
const loginUser = async (input, metadata) => {
    const user = await database_1.default.user.findUnique({
        where: { email: input.email },
    });
    if (!user) {
        throw new httpError_1.default(401, "Invalid credentials");
    }
    if (!user.isActive) {
        throw new httpError_1.default(403, "Account is disabled");
    }
    const isMatch = await bcryptjs_1.default.compare(input.password, user.passwordHash);
    if (!isMatch) {
        throw new httpError_1.default(401, "Invalid credentials");
    }
    const { token, refreshRecord } = await issueSession(user.id, metadata);
    const accessToken = (0, token_1.createAccessToken)(buildAccessPayload(user));
    return {
        user: sanitizeUser(user),
        accessToken,
        refreshToken: token,
        accessTokenExpiresIn: token_1.tokenConfig.accessTtl,
        refreshTokenExpiresAt: refreshRecord.expiresAt.toISOString(),
    };
};
exports.loginUser = loginUser;
const refreshSession = async (refreshToken, metadata) => {
    const hashed = (0, token_1.hashToken)(refreshToken);
    return database_1.default.$transaction(async (tx) => {
        const existing = await tx.refreshToken.findUnique({
            where: { tokenHash: hashed },
            include: { user: true },
        });
        if (!existing) {
            throw new httpError_1.default(401, "Invalid refresh token");
        }
        if (existing.revokedAt) {
            console.warn("Refresh token reuse detected", JSON.stringify({ tokenId: existing.id, userId: existing.userId }));
            throw new httpError_1.default(401, "Invalid refresh token");
        }
        if (existing.expiresAt.getTime() < Date.now()) {
            throw new httpError_1.default(401, "Invalid refresh token");
        }
        if (!existing.user.isActive) {
            throw new httpError_1.default(403, "Account is disabled");
        }
        const { token, refreshRecord } = await issueSession(existing.userId, metadata, tx);
        await tx.refreshToken.update({
            where: { id: existing.id },
            data: {
                revokedAt: new Date(),
                replacedById: refreshRecord.id,
            },
        });
        const accessToken = (0, token_1.createAccessToken)(buildAccessPayload(existing.user));
        return {
            user: sanitizeUser(existing.user),
            accessToken,
            refreshToken: token,
            accessTokenExpiresIn: token_1.tokenConfig.accessTtl,
            refreshTokenExpiresAt: refreshRecord.expiresAt.toISOString(),
        };
    });
};
exports.refreshSession = refreshSession;
const revokeSession = async (refreshToken) => {
    const hashed = (0, token_1.hashToken)(refreshToken);
    await database_1.default.refreshToken.updateMany({
        where: { tokenHash: hashed, revokedAt: null },
        data: { revokedAt: new Date() },
    });
};
exports.revokeSession = revokeSession;
//# sourceMappingURL=authService.js.map