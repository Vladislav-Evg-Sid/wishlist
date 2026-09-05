import type { Knex } from "knex";

import { config as envConfig } from "./src/config/env.ts";

const config: Record<string, Knex.Config> = {
  development: {
    client: "pg",

    connection: {
      host: envConfig.db.connection.host,
      port: envConfig.db.connection.port,
      user: envConfig.db.connection.user,
      password: envConfig.db.connection.password,
      database: envConfig.db.connection.database,
    },

    migrations: {
      directory: "./src/db/migrations",
      extension: "ts",
    },

    seeds: {
      directory: "./src/db/seeds",
      extension: "ts",
    },
  },
};

export default config;
