import { db } from "../../../src/db/knex.js";
import { TABLES, REFRESH_TOKENS_COLUMNS } from "../../../src/db/schema.js";
import type { UUID } from "../../../src/types/shared.js";
import type { RefreshTokenRaw } from "../../../src/modules/auth/auth.repository.dto.js";

export async function createRefreshToken(
  userID: UUID,
  jti: string,
  expiresAt: Date = new Date(Date.now() + 3600000),
  userAgent?: string,
): Promise<RefreshTokenRaw> {
  const [record] = await db<RefreshTokenRaw>(TABLES.refresh_tokens)
    .insert({
      [REFRESH_TOKENS_COLUMNS.user_id]: userID,
      [REFRESH_TOKENS_COLUMNS.jti]: jti,
      [REFRESH_TOKENS_COLUMNS.expires_at]: expiresAt,
      [REFRESH_TOKENS_COLUMNS.user_agent]: userAgent ?? null,
    })
    .returning("*");

  if (!record) {
    throw new Error("Failed to create refresh token fixture");
  }

  return record;
}
