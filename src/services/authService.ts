import bcrypt from "bcryptjs";
import prisma from "../models/database";
import HttpError from "../utils/httpError";
import {
  AccessTokenPayload,
  createAccessToken,
  generateRefreshToken,
  hashToken,
  tokenConfig,
} from "../utils/token";

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? "12");

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

const sanitizeUser = <T extends { passwordHash: string }>(user: T) => {
  const { passwordHash, ...rest } = user;
  return rest;
};

const buildAccessPayload = (user: { id: string; email: string; username: string }): AccessTokenPayload => ({
  sub: user.id,
  email: user.email,
  username: user.username,
});

const issueSession = async (
  userId: string,
  metadata: SessionMetadata,
  tx = prisma
) => {
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
};

export const registerUser = async (
  input: RegisterInput,
  metadata: SessionMetadata
) => {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email: input.email }, { username: input.username }],
    },
  });

  if (existing) {
    throw new HttpError(409, "Email or username already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      username: input.username,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      age: input.age,
      avatarUrl: input.avatarUrl,
      friendsCount: input.friendsCount,
    },
  });

  const { token, refreshRecord } = await issueSession(user.id, metadata);
  const accessToken = createAccessToken(buildAccessPayload(user));

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken: token,
    accessTokenExpiresIn: tokenConfig.accessTtl,
    refreshTokenExpiresAt: refreshRecord.expiresAt.toISOString(),
  };
};

export const loginUser = async (input: LoginInput, metadata: SessionMetadata) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new HttpError(401, "Invalid credentials");
  }

  if (!user.isActive) {
    throw new HttpError(403, "Account is disabled");
  }

  const isMatch = await bcrypt.compare(input.password, user.passwordHash);

  if (!isMatch) {
    throw new HttpError(401, "Invalid credentials");
  }

  const { token, refreshRecord } = await issueSession(user.id, metadata);
  const accessToken = createAccessToken(buildAccessPayload(user));

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken: token,
    accessTokenExpiresIn: tokenConfig.accessTtl,
    refreshTokenExpiresAt: refreshRecord.expiresAt.toISOString(),
  };
};

export const refreshSession = async (
  refreshToken: string,
  metadata: SessionMetadata
) => {
  const hashed = hashToken(refreshToken);

  return prisma.$transaction(async (tx) => {
    const existing = await tx.refreshToken.findUnique({
      where: { tokenHash: hashed },
      include: { user: true },
    });

    if (
      !existing ||
      existing.revokedAt ||
      existing.expiresAt.getTime() < Date.now()
    ) {
      throw new HttpError(401, "Invalid refresh token");
    }

    if (!existing.user.isActive) {
      throw new HttpError(403, "Account is disabled");
    }

    const { token, refreshRecord } = await issueSession(
      existing.userId,
      metadata,
      tx
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
};

export const revokeSession = async (refreshToken: string) => {
  const hashed = hashToken(refreshToken);

  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashed, revokedAt: null },
    data: { revokedAt: new Date() },
  });
};
