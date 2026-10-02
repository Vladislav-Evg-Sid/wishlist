import app from "./app.js";
import { config } from "./config/env.js";
import { db } from "./db/knex.js";
import { redis } from "./redis/redis.js";

await db.raw("select 1");
console.log("Database connected");

await redis.connect();
console.log("Redis connected");

// Startup
const server = app.listen(config.port, () => {
  console.log(`Server started: http://localhost:${config.port}`);
  console.log(`Swagger: http://localhost:${config.port}/api-docs`);
});

let isShuttingDown = false;

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(`Received ${signal}. Shutting down...`);

  const shutdownTimeout = setTimeout(() => {
    console.error("Graceful shutdown timeout exceeded");
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

    console.log("Shutdown completed");
  } catch (error) {
    console.error("Shutdown failed", error);
    process.exitCode = 1;
  }
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
