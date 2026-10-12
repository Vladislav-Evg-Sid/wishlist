import {
  Injectable,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common";
import { createClient } from "redis";

import { config } from "../../config/env.js";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  readonly client = createClient({
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
}
