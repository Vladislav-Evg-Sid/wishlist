import { Inject, Injectable } from "@nestjs/common";

import type { AuthBlacklistServiceInterface } from "./auth.di.js";
import { RedisService } from "../../infrastructure/redis/redis.service.js";
import {
  REDIS_SERVICE,
  type redisServiceInterface,
} from "../../infrastructure/redis/redis.di.js";

@Injectable()
export class AuthBlacklistService implements AuthBlacklistServiceInterface {
  private readonly redisPrefix: string = "reft:bl";

  constructor(
    @Inject(REDIS_SERVICE)
    private readonly redisService: redisServiceInterface,
  ) {}

  async isRefreshBlacklisted(jti: string): Promise<boolean> {
    const result = await this.redisService.valueIsExist(this.redisPrefix, jti);
    return result === 1;
  }

  async blacklistRefreshToken(jti: string, expiresAt: number): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    const ttl = expiresAt - now;

    if (ttl <= 0) {
      return;
    }

    await this.redisService.setValue(this.redisPrefix, jti, "1", ttl);
  }
}
