import { Injectable } from "@nestjs/common";

import type { AuthBlacklistServiceInterface } from "./auth.di.js";
import { RedisService } from "../../infrastructure/redis/redis.service.js";

@Injectable()
export class AuthBlacklistService implements AuthBlacklistServiceInterface {
  constructor(private readonly redisService: RedisService) {}

  private getRefreshBlacklistKey(jti: string): string {
    return `reft:bl:${jti}`;
  }

  async isRefreshBlacklisted(jti: string): Promise<boolean> {
    const result = await this.redisService.client.exists(
      this.getRefreshBlacklistKey(jti),
    );
    return result === 1;
  }

  async blacklistRefreshToken(jti: string, expiresAt: number): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    const ttl = expiresAt - now;

    if (ttl <= 0) {
      return;
    }

    await this.redisService.client.set(this.getRefreshBlacklistKey(jti), "1", {
      EX: ttl,
    });
  }
}
