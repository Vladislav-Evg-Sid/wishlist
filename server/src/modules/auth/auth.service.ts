import bcrypt from "bcrypt";

import {
  verifyRefreshToken,
  createAccessToken,
  createRefreshToken,
} from "./jwt.service.js";
import {
  isRefreshBlacklisted,
  blacklistRefreshToken,
} from "./auth.blacklist.js";
import {
  createUser,
  findMaxUserHash,
  findUserByEmail,
  findUserByID,
} from "./auth.repository.js";
import { config } from "../../config/env.js";
import {
  createRefreshTokenRecord,
  findRefreshTokenByJti,
  revokeAllUserRefreshTokens,
  revokeRefreshToken,
} from "./jwt.repository.js";
import type {
  UserData,
  UserLoginData,
  UserRegisterData,
} from "./auth.types.js";
import type { UUID } from "../../types/shared.js";
import {
  DataConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/errors.js";

async function issueTokens(userID: UUID, userAgent?: string) {
  const accessToken = createAccessToken(userID);
  const { token: refreshToken, jti } = createRefreshToken(userID);

  const refreshPayload = verifyRefreshToken(refreshToken);

  await createRefreshTokenRecord({
    userId: userID,
    jti,
    expiresAt: new Date(refreshPayload.exp * 1000),
    userAgent,
  });

  return {
    accessToken,
    refreshToken,
  };
}

export async function refreshTokens(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const blacklisted = await isRefreshBlacklisted(payload.jti);
  if (blacklisted) {
    throw new UnauthorizedError("Refresh token revoked");
  }

  const refreshTokenData = await findRefreshTokenByJti(payload.jti);
  if (!refreshTokenData) {
    throw new UnauthorizedError("Refresh token session not found");
  }

  if (refreshTokenData.revoked_at) {
    throw new UnauthorizedError("Refresh token revoked");
  }

  await blacklistRefreshToken(payload.jti, payload.exp);
  await revokeRefreshToken(payload.jti);

  return issueTokens(payload.sub, refreshTokenData.user_agent ?? undefined);
}

async function getCurrentUserHash(username: string): Promise<number> {
  const maxHash = await findMaxUserHash(username);
  return maxHash + 1;
}

export async function registerUser(
  { email, username, password }: UserRegisterData,
  userAgent?: string,
) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new DataConflictError("User with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, config.auth.bcryptRounds);
  const userHash = await getCurrentUserHash(username);
  const user = await createUser(username, email, passwordHash, userHash);

  if (!user) {
    throw new InternalServerError("Can't create user");
  }
  return issueTokens(user.id, userAgent);
}

export async function loginUser(
  { email, password }: UserLoginData,
  userAgent?: string,
) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new NotFoundError("Invalid email");
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);
  if (!passwordValid) {
    throw new NotFoundError("Invalid password for this email");
  }

  return issueTokens(user.id, userAgent);
}

export async function logoutUser(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const refreshTokenData = await findRefreshTokenByJti(payload.jti);
  if (!refreshTokenData) {
    throw new UnauthorizedError("Refresh token session not found");
  }
  if (refreshTokenData.revoked_at) {
    return;
  }
  await revokeRefreshToken(payload.jti);
  await blacklistRefreshToken(payload.jti, payload.exp);
}

export async function revokeAllUserRefresh(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const refreshTokenData = await findRefreshTokenByJti(payload.jti);
  if (!refreshTokenData) {
    throw new NotFoundError("Refresh token session not found");
  }

  const allUserActiveRefresh = await revokeAllUserRefreshTokens(
    refreshTokenData.user_id,
  );
  for (const userRefresh of allUserActiveRefresh) {
    blacklistRefreshToken(userRefresh.jti, userRefresh.expires_at);
  }
}

export async function getUserData(userID: UUID): Promise<UserData> {
  const userData = await findUserByID(userID);
  if (!userData) {
    throw new NotFoundError("Refresh token session not found");
  }
  return userData;
}
