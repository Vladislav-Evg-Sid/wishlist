import app from "./app.js";
import { config } from "./config/env.js";
import { logger } from "./config/logger.js";
import { db } from "./db/knex.js";
import { redis } from "./redis/redis.js";

await db.raw("select 1");
logger.info("Database connected");

await redis.connect();
logger.info("Redis connected");

// Startup
const server = app.listen(config.port, () => {
  logger.info(`Server started: http://localhost:${config.port}`);
  logger.info(`Swagger: http://localhost:${config.port}/api-docs`);
});

let isShuttingDown = false;

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  logger.info(`Received ${signal}. Shutting down...`);

  const shutdownTimeout = setTimeout(() => {
    logger.warn("Graceful shutdown timeout exceeded");
    process.exit(1);
  }, 10_000);
  shutdownTimeout.unref();

  try {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    await db.destroy();
    await redis.quit();

    logger.info("Shutdown completed");
  } catch (error) {
    logger.fatal(`Shutdown failed: ${error}`);
    process.exitCode = 1;
  }
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
