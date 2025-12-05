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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const httpError_1 = __importDefault(require("../utils/httpError"));
const token_1 = require("../utils/token");
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? '12');
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
let AuthService = class AuthService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async issueSession(userId, metadata, tx = this.prisma) {
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
    }
    async registerUser(input, metadata) {
        const existing = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: input.email }, { username: input.username }],
            },
        });
        if (existing) {
            throw new httpError_1.default(409, 'Email or username already exists');
        }
        const passwordHash = await bcryptjs_1.default.hash(input.password, SALT_ROUNDS);
        const user = await this.prisma.user.create({
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
        const { token, refreshRecord } = await this.issueSession(user.id, metadata);
        const accessToken = (0, token_1.createAccessToken)(buildAccessPayload(user));
        return {
            user: sanitizeUser(user),
            accessToken,
            refreshToken: token,
            accessTokenExpiresIn: token_1.tokenConfig.accessTtl,
            refreshTokenExpiresAt: refreshRecord.expiresAt.toISOString(),
        };
    }
    async loginUser(input, metadata) {
        const user = await this.prisma.user.findUnique({
            where: { email: input.email },
        });
        if (!user) {
            throw new httpError_1.default(401, 'Invalid credentials');
        }
        if (!user.isActive) {
            throw new httpError_1.default(403, 'Account is disabled');
        }
        const isMatch = await bcryptjs_1.default.compare(input.password, user.passwordHash);
        if (!isMatch) {
            throw new httpError_1.default(401, 'Invalid credentials');
        }
        const { token, refreshRecord } = await this.issueSession(user.id, metadata);
        const accessToken = (0, token_1.createAccessToken)(buildAccessPayload(user));
        return {
            user: sanitizeUser(user),
            accessToken,
            refreshToken: token,
            accessTokenExpiresIn: token_1.tokenConfig.accessTtl,
            refreshTokenExpiresAt: refreshRecord.expiresAt.toISOString(),
        };
    }
    async refreshSession(refreshToken, metadata) {
        const hashed = (0, token_1.hashToken)(refreshToken);
        return this.prisma.$transaction(async (tx) => {
            const existing = await tx.refreshToken.findUnique({
                where: { tokenHash: hashed },
                include: { user: true },
            });
            if (!existing) {
                throw new httpError_1.default(401, 'Invalid refresh token');
            }
            if (existing.revokedAt) {
                console.warn('Refresh token reuse detected', JSON.stringify({ tokenId: existing.id, userId: existing.userId }));
                throw new httpError_1.default(401, 'Invalid refresh token');
            }
            if (existing.expiresAt.getTime() < Date.now()) {
                throw new httpError_1.default(401, 'Invalid refresh token');
            }
            if (!existing.user.isActive) {
                throw new httpError_1.default(403, 'Account is disabled');
            }
            const { token, refreshRecord } = await this.issueSession(existing.userId, metadata, tx);
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
    }
    async revokeSession(refreshToken) {
        const hashed = (0, token_1.hashToken)(refreshToken);
        await this.prisma.refreshToken.updateMany({
            where: { tokenHash: hashed, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map