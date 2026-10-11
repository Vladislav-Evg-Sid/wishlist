import knex from "knex";

import { config } from "../config/env.js";

const quoteIdentifier = (identifier: string): string =>
  `"${identifier.replaceAll('"', '""')}"`;

const { host, port, user, password, database } = config.db.connection;

const adminDb = knex({
  client: config.db.client,
  connection: { host, port, user, password, database: "postgres" },
});

try {
  const result: { rows: Array<{ exists: boolean }> } = await adminDb.raw(
    "SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = ?) AS exists",
    [database],
  );

  if (!result.rows[0]?.exists) {
    await adminDb.raw(
      `CREATE DATABASE ${quoteIdentifier(database)} OWNER ${quoteIdentifier(user)}`,
    );
    console.log(`Created database ${database}`);
  }
} finally {
  await adminDb.destroy();
}

const db = knex({
  client: config.db.client,
  connection: { host, port, user, password, database },
});

try {
  const [batch, migrations] = await db.migrate.latest({
    directory: "./src/db/migrations",
    extension: "ts",
  });

  if (migrations.length === 0) {
    console.log(`Database ${database} is already up to date`);
  } else {
    console.log(
      `Applied migration batch ${batch}: ${migrations.join(", ")}`,
    );
  }
} finally {
  await db.destroy();
}
