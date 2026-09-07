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
} from "./auth.repository.js";
import { config } from "../../config/env.js";
import {
  createRefreshTokenRecord,
  findRefreshTokenByJti,
  revokeAllUserRefreshTokens,
  revokeRefreshToken,
} from "./jwt.repository.js";

async function issueTokens(userId: string, userAgent?: string) {
  const accessToken = createAccessToken(userId);
  const { token: refreshToken, jti } = createRefreshToken(userId);

  const refreshPayload = verifyRefreshToken(refreshToken);

  await createRefreshTokenRecord({
    userId,
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
    throw new Error("Refresh token revoked");
  }

  const refreshTokenData = await findRefreshTokenByJti(payload.jti);
  if (!refreshTokenData) {
    throw new Error("Refresh token session not found");
  }

  if (refreshTokenData.revoked_at) {
    throw new Error("Refresh token revoked");
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
  email: string,
  name: string,
  password: string,
  userAgent?: string,
) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, config.auth.bcryptRounds);
  const userHash = await getCurrentUserHash(name);
  const user = await createUser(name, email, passwordHash, userHash);

  if (!user) {
    throw new Error("Can't create user");
  }
  return issueTokens(user.id, userAgent);
}

export async function loginUser(
  email: string,
  password: string,
  userAgent?: string,
) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email");
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);
  if (!passwordValid) {
    throw new Error("Invalid password for this email");
  }

  return issueTokens(user.id, userAgent);
}

export async function logoutUser(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const refreshTokenData = await findRefreshTokenByJti(payload.jti);
  if (!refreshTokenData) {
    throw new Error("Refresh token session not found");
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
    throw new Error("Refresh token session not found");
  }

  const allUserActiveRefresh = await revokeAllUserRefreshTokens(
    refreshTokenData.user_id,
  );
  for (const userRefresh of allUserActiveRefresh) {
    blacklistRefreshToken(userRefresh.jti, userRefresh.expires_at);
  }
}
