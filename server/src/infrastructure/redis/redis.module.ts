import { Module } from "@nestjs/common";

import { RedisService } from "./redis.service.js";
import { REDIS_SERVICE } from "./redis.di.js";

@Module({
  providers: [{ provide: REDIS_SERVICE, useClass: RedisService }],
  exports: [REDIS_SERVICE],
})
export class RedisModule {}
