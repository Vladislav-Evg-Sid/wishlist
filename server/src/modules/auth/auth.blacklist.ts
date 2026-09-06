import { redis } from "../../redis/redis.js";

function getRefreshBlacklistKey(jti: string): string {
  return `reft:bl:${jti}`;
}

export async function isRefreshBlacklisted(jti: string): Promise<boolean> {
  const result = await redis.exists(getRefreshBlacklistKey(jti));
  return result === 1;
}

export async function blacklistRefreshToken(
  jti: string,
  expiresAt: number,
): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  const ttl = expiresAt - now;

  if (ttl <= 0) {
    return;
  }

  await redis.set(getRefreshBlacklistKey(jti), "1", {
    EX: ttl,
  });
}
