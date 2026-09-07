import { db } from "../../db/knex.js";
import { TABLES, REFRESH_TOKENS_COLUMNS } from "../../db/schema.js";
import type { RefreshTokenRaw } from "./auth.dto.js";

type CreateRefreshTokenData = {
  userId: string;
  jti: string;
  expiresAt: Date;
  userAgent: string | undefined;
};

export async function createRefreshTokenRecord(
  data: CreateRefreshTokenData,
): Promise<RefreshTokenRaw> {
  const [record] = await db<RefreshTokenRaw>(TABLES.refresh_tokens)
    .insert({
      [REFRESH_TOKENS_COLUMNS.user_id]: data.userId,
      [REFRESH_TOKENS_COLUMNS.jti]: data.jti,
      [REFRESH_TOKENS_COLUMNS.expires_at]: data.expiresAt,
      [REFRESH_TOKENS_COLUMNS.user_agent]: data.userAgent ?? null,
    })
    .returning("*");

  if (!record) {
    throw new Error("Failed to create refresh token record");
  }

  return record;
}

export async function findRefreshTokenByJti(
  jti: string,
): Promise<RefreshTokenRaw | undefined> {
  return db<RefreshTokenRaw>(TABLES.refresh_tokens)
    .where({ [REFRESH_TOKENS_COLUMNS.jti]: jti })
    .first();
}

export async function revokeRefreshToken(jti: string): Promise<void> {
  await db(TABLES.refresh_tokens)
    .where({ [REFRESH_TOKENS_COLUMNS.jti]: jti })
    .update({
      [REFRESH_TOKENS_COLUMNS.revoked_at]: db.fn.now(),
    });
}

export async function revokeAllUserRefreshTokens(userId: string) {
  return db(TABLES.refresh_tokens)
    .where({
      [REFRESH_TOKENS_COLUMNS.user_id]: userId,
      [REFRESH_TOKENS_COLUMNS.revoked_at]: null,
    })
    .update({
      [REFRESH_TOKENS_COLUMNS.revoked_at]: db.fn.now(),
    })
    .returning([REFRESH_TOKENS_COLUMNS.jti, REFRESH_TOKENS_COLUMNS.expires_at]);
}

export async function deleteExpiredRefreshTokens(): Promise<number> {
  return db(TABLES.refresh_tokens)
    .where(REFRESH_TOKENS_COLUMNS.expires_at, "<", db.fn.now())
    .delete();
}
