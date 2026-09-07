import { db } from "../../db/knex.js";
import { TABLES, USER_COLUMNS } from "../../db/schema.js";
import type { User } from "./auth.types.js";

export async function findUserByEmail(
  email: string,
): Promise<User | undefined> {
  return db(TABLES.users)
    .select(
      USER_COLUMNS.id,
      USER_COLUMNS.email,
      USER_COLUMNS.username,
      USER_COLUMNS.user_hash,
      USER_COLUMNS.password_hash,
    )
    .where({ [USER_COLUMNS.email]: email })
    .first();
}

export async function findUserByID(id: string): Promise<User> {
  return db(TABLES.users)
    .select(
      USER_COLUMNS.id,
      USER_COLUMNS.email,
      USER_COLUMNS.username,
      USER_COLUMNS.user_hash,
      USER_COLUMNS.password_hash,
    )
    .where({ [USER_COLUMNS.id]: id })
    .first();
}
