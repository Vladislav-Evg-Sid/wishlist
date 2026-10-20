import {
  Injectable,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common";
import { createClient } from "redis";

import { config } from "../../config/env.js";
import type {
  redisServiceAuthInterface,
  redisServiceInviteInterface,
} from "./redis.di.js";
import type { UUID } from "../../types/shared.js";
import { InternalServerError } from "../../shared/errors.js";
import { logger } from "../../config/logger.js";

@Injectable()
export class RedisService
  implements
    OnModuleInit,
    OnModuleDestroy,
    redisServiceAuthInterface,
    redisServiceInviteInterface
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
    await this.client.set(`${prefix}:${key}`, value, {
      EX: ttl ? ttl : 60 * 60 * 24 * 30,
    });
  }

  async getValue(prefix: string, key: string): Promise<any> {
    return this.client.get(`${prefix}:${key}`);
  }

  async valueIsExist(prefix: string, key: string): Promise<any> {
    return this.client.exists(`${prefix}:${key}`);
  }

  async setHashCounterValue(
    prefix: string,
    key: string,
    payloadName: string,
    payloadValue: any,
    counterName: string,
    counterValue: number,
    ttl?: number,
  ): Promise<boolean> {
    const createInviteScript = `
      local key = KEYS[1]
      local payloadName = ARGV[1]
      local payloadValue = ARGV[2]
      local counterName = ARGV[3]
      local counterValue = ARGV[4]
      local ttl = tonumber(ARGV[5])

      if redis.call("EXISTS", key) == 1 then
        return 0
      end

      redis.call("HSET", key,
        payloadName, payloadValue,
        counterName, counterValue
      )

      if ttl and ttl > 0 then
        redis.call("EXPIRE", key, ttl)
      end

      return 1
    `;
    logger.debug("start");
    const created = await this.client.eval(createInviteScript, {
      keys: [`${prefix}:${key}`],
      arguments: [
        payloadName,
        String(payloadValue),
        counterName,
        String(counterValue),
        String(ttl),
      ],
    });
    logger.debug({ value: created }, "end");
    if (created === 1) {
      return true;
    }
    if (created === 0) {
      return false;
    }
    throw new InternalServerError("Unknown redis error");
  }

  async getHashValueWithDecrementing(
    prefix: string,
    key: string,
    counterName: string,
    payloadName: string,
  ): Promise<any> {
    const script = `
      local key = KEYS[1]
      local field = ARGV[1]
      local payload = ARGV[2]

      if redis.call("EXISTS", key) == 0 then
        return false
      end

      local payloadValue = redis.call("HGET", key, payload)
      local value = tonumber(redis.call("HGET", key, field))

      if not value then
        return false
      end

      -- Безлимитное приглашение
      if value == -1 then
        return payloadValue
      end

      -- Осталось больше одного использования
      if value > 1 then
        redis.call("HINCRBY", key, field, -1)
        return payloadValue
      end

      -- Последнее использование
      if value == 1 then
        redis.call("DEL", key)
        return payloadValue
      end

      -- 0 — некорректное состояние
      if value == 0 then
        redis.call("DEL", key)
        return false
      end

      -- На случай неожиданного значения < -1
      return false
    `;
    const payload = await this.client.eval(script, {
      keys: [`${prefix}:${key}`],
      arguments: [counterName, payloadName],
    });

    return payload;
  }
}
