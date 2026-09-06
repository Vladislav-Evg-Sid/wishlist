import type { SignOptions } from "jsonwebtoken";

type JwtTTL = NonNullable<SignOptions["expiresIn"]>;

export const config = {
  port: Number(process.env.PORT ?? 8000),
  clientHost: process.env.CLIENT_HOST ?? "frontend",
  clientPort: Number(process.env.CLIENT_HOST_PORT ?? 5173),

  db: {
    client: process.env.DB_CLIENT ?? "pg",
    connection: {
      host: process.env.DB_HOST ?? "localhost",
      port: Number(process.env.DB_PORT ?? 5432),
      name: process.env.DB_NAME ?? "wishlist",
      user: process.env.DB_USER ?? "postgres",
      password: process.env.DB_PASSWORD ?? "postgres",
      database: process.env.DB_NAME ?? "wishlist",
    },
  },

  redis: {
    port: process.env.REDIS_PORT ?? "6379",
    host: process.env.REDIS_HOST ?? "redis",
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    accessTTL: process.env.JWT_ACCESS_TTL as JwtTTL,
    refreshTTL: process.env.JWT_REFRESH_TTL as JwtTTL,
  },
};
