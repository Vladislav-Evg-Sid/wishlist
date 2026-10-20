import {
  Injectable,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common";
import { createClient } from "redis";

import { config } from "../../config/env.js";
import type { redisServiceInterface } from "./redis.di.js";

@Injectable()
export class RedisService
  implements OnModuleInit, OnModuleDestroy, redisServiceInterface
{
  private readonly client = createClient({
    url: `redis://${config.redis.host}:${config.redis.port}`,
  });

  async onModuleInit(): Promise<void> {
    await this.client.connect();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }

  async setValue(
    prefix: string,
    key: string,
    value: any,
    ttl?: number,
  ): Promise<void> {
    let options = undefined;
    if (ttl) {
      options = { EX: ttl };
    }

    await this.client.set(`${prefix}:${key}`, value, options);
  }

  async getValue(prefix: string, key: string): Promise<any> {
    return this.client.get(`${prefix}:${key}`);
  }

  async valueIsExist(prefix: string, key: string): Promise<any> {
    return this.client.exists(`${prefix}:${key}`);
  }
}
