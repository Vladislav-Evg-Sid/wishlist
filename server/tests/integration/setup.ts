import { beforeAll, afterAll, beforeEach } from "@jest/globals";

import { db } from "../../src/db/knex.js";

beforeAll(async () => {
  await db.raw("SELECT 1");
  await db.migrate.latest({
    directory: "./src/db/migrations",
  });
});

afterAll(async () => {
  await db.destroy();
});

beforeEach(async () => {
  await db.raw(`
    TRUNCATE TABLE
      card,
      wishlist,
      group_member,
      groups,
      users
    RESTART IDENTITY CASCADE
  `);
});
