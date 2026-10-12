import { Injectable } from "@nestjs/common";

import { redis } from "../../redis/redis.js";
import type { AuthBlacklistServiceInterface } from "./auth.di.js";

@Injectable()
export class AuthBlacklistService implements AuthBlacklistServiceInterface {
  private getRefreshBlacklistKey(jti: string): string {
    return `reft:bl:${jti}`;
  }

  async isRefreshBlacklisted(jti: string): Promise<boolean> {
    const result = await redis.exists(this.getRefreshBlacklistKey(jti));
    return result === 1;
  }

  async blacklistRefreshToken(jti: string, expiresAt: number): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    const ttl = expiresAt - now;

    if (ttl <= 0) {
      return;
    }

    await redis.set(this.getRefreshBlacklistKey(jti), "1", {
      EX: ttl,
    });
  }
}
