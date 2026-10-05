import { createClient } from "redis";

import { config } from "../config/env.js";
import { logger } from "../config/logger.js";

export const redis = createClient({
  url: `redis://${config.redis.host}:${config.redis.port}`,
});

redis.on("error", (err) => {
  logger.error("Redis error:", err);
});
