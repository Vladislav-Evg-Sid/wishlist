import { createClient } from "redis";

import { config } from "../config/env.js";

export const redis = createClient({
  url: `redis://${config.redis.host}:${config.redis.port}`,
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});
