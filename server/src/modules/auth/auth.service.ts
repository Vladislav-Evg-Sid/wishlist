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

export async function refreshTokens(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const blacklisted = await isRefreshBlacklisted(payload.jti);
  if (blacklisted) {
    throw new Error("Refresh token revoked");
  }
  await blacklistRefreshToken(payload.jti, payload.exp);

  const accessToken = createAccessToken(payload.sub);
  const newRefreshToken = createRefreshToken(payload.sub).token;

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
}

async function getCurrentUserHash(username: string): Promise<number> {
  const maxHash = await findMaxUserHash(username);
  return maxHash + 1;
}

export async function registerUser(
  email: string,
  name: string,
  password: string,
) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, config.auth.bcryptRounds);
  const userHash = await getCurrentUserHash(name);
  const user = await createUser(name, email, passwordHash, userHash);
}
