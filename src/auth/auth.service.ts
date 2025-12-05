import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { Prisma, Role, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import HttpError from '../utils/httpError';
import {
  AccessTokenPayload,
  createAccessToken,
  generateRefreshToken,
  hashToken,
  tokenConfig,
} from '../utils/token';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? '12');

interface RegisterInput {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  age: number;
  avatarUrl?: string;
  friendsCount?: number;
}

interface LoginInput {
  email: string;
  password: string;
}

interface SessionMetadata {
  ip?: string;
  userAgent?: string;
}

const sanitizeUser = <T extends { passwordHash: string }>(
  user: T,
): Omit<T, 'passwordHash'> => {
  const { passwordHash, ...rest } = user;
  return rest;
};

const buildAccessPayload = (
  user: Pick<User, 'id' | 'email' | 'username' | 'role'>,
): AccessTokenPayload => ({
  sub: user.id,
  email: user.email,
  username: user.username,
  role: user.role,
});

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  private async issueSession(
    userId: string,
    metadata: SessionMetadata,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    const { token, tokenHash, expiresAt } = generateRefreshToken();

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

  async registerUser(input: RegisterInput, metadata: SessionMetadata) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: input.email }, { username: input.username }],
      },
    });

    if (existing) {
      throw new HttpError(409, 'Email or username already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

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
        role: Role.USER,
      },
    });

    const { token, refreshRecord } = await this.issueSession(user.id, metadata);
    const accessToken = createAccessToken(buildAccessPayload(user));

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken: token,
      accessTokenExpiresIn: tokenConfig.accessTtl,
      refreshTokenExpiresAt: refreshRecord.expiresAt.toISOString(),
    };
  }

  async loginUser(input: LoginInput, metadata: SessionMetadata) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new HttpError(401, 'Invalid credentials');
    }

    if (!user.isActive) {
      throw new HttpError(403, 'Account is disabled');
    }

    const isMatch = await bcrypt.compare(input.password, user.passwordHash);

    if (!isMatch) {
      throw new HttpError(401, 'Invalid credentials');
    }

    const { token, refreshRecord } = await this.issueSession(user.id, metadata);
    const accessToken = createAccessToken(buildAccessPayload(user));

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken: token,
      accessTokenExpiresIn: tokenConfig.accessTtl,
      refreshTokenExpiresAt: refreshRecord.expiresAt.toISOString(),
    };
  }

  async refreshSession(refreshToken: string, metadata: SessionMetadata) {
    const hashed = hashToken(refreshToken);

    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.refreshToken.findUnique({
        where: { tokenHash: hashed },
        include: { user: true },
      });

      if (!existing) {
        throw new HttpError(401, 'Invalid refresh token');
      }

      if (existing.revokedAt) {
        console.warn(
          'Refresh token reuse detected',
          JSON.stringify({ tokenId: existing.id, userId: existing.userId }),
        );
        throw new HttpError(401, 'Invalid refresh token');
      }

      if (existing.expiresAt.getTime() < Date.now()) {
        throw new HttpError(401, 'Invalid refresh token');
      }

      if (!existing.user.isActive) {
        throw new HttpError(403, 'Account is disabled');
      }

      const { token, refreshRecord } = await this.issueSession(
        existing.userId,
        metadata,
        tx,
      );

      await tx.refreshToken.update({
        where: { id: existing.id },
        data: {
          revokedAt: new Date(),
          replacedById: refreshRecord.id,
        },
      });

      const accessToken = createAccessToken(buildAccessPayload(existing.user));

      return {
        user: sanitizeUser(existing.user),
        accessToken,
        refreshToken: token,
        accessTokenExpiresIn: tokenConfig.accessTtl,
        refreshTokenExpiresAt: refreshRecord.expiresAt.toISOString(),
      };
    });
  }

  async revokeSession(refreshToken: string) {
    const hashed = hashToken(refreshToken);

    await this.prisma.refreshToken.updateMany({
      where: { tokenHash: hashed, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}







