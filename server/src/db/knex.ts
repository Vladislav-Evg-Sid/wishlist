import knex from "knex";

import { config } from "../config/env.js";

export const db = knex({
  client: config.db.client,

  connection: {
    host: config.db.connection.host,
    port: config.db.connection.port,
    user: config.db.connection.user,
    password: config.db.connection.password,
    database: config.db.connection.database,
  },
});
