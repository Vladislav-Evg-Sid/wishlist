import {
  verifyRefreshToken,
  createAccessToken,
  createRefreshToken,
} from "./auth.jwt.js";

import {
  isRefreshBlacklisted,
  blacklistRefreshToken,
} from "./auth.blacklist.js";

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
