import { Injectable } from "@nestjs/common";

import { db } from "../../db/knex.js";
import { TABLES, REFRESH_TOKENS_COLUMNS } from "../../db/schema.js";
import { InternalServerError } from "../../shared/errors.js";
import type { UUID } from "../../types/shared.js";
import type { RefreshTokenRaw } from "./auth.repository.dto.js";
import type { JwtRepositoryInterface } from "./auth.di.js";
import type {
  CreateRefreshTokenData,
  RevokeRefreshTokenData,
} from "./jwt.types.js";

@Injectable()
export class JwtRepository implements JwtRepositoryInterface {
  async createRefreshTokenRecord(
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
      throw new InternalServerError("Failed to create refresh token record");
    }

    return record;
  }

  async findRefreshTokenByJti(
    jti: string,
  ): Promise<RefreshTokenRaw | undefined> {
    return db<RefreshTokenRaw>(TABLES.refresh_tokens)
      .where({ [REFRESH_TOKENS_COLUMNS.jti]: jti })
      .first();
  }

  async revokeRefreshToken(jti: string): Promise<void> {
    await db(TABLES.refresh_tokens)
      .where({ [REFRESH_TOKENS_COLUMNS.jti]: jti })
      .update({
        [REFRESH_TOKENS_COLUMNS.revoked_at]: db.fn.now(),
      });
  }

  async revokeAllUserRefreshTokens(
    userId: UUID,
  ): Promise<RevokeRefreshTokenData[]> {
    return db(TABLES.refresh_tokens)
      .where({
        [REFRESH_TOKENS_COLUMNS.user_id]: userId,
        [REFRESH_TOKENS_COLUMNS.revoked_at]: null,
      })
      .update({
        [REFRESH_TOKENS_COLUMNS.revoked_at]: db.fn.now(),
      })
      .returning([
        REFRESH_TOKENS_COLUMNS.jti,
        REFRESH_TOKENS_COLUMNS.expires_at,
      ]);
  }

  async deleteExpiredRefreshTokens(): Promise<number> {
    return db(TABLES.refresh_tokens)
      .where(REFRESH_TOKENS_COLUMNS.expires_at, "<", db.fn.now())
      .delete();
  }
}
