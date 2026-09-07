import { db } from "../../db/knex.js";
import { TABLES, USER_COLUMNS } from "../../db/schema.js";
import type { UserRaw } from "./auth.dto.js";
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

export async function createUser(
  username: string,
  email: string,
  passwordHash: string,
  user_hash: number,
) {
  return db<UserRaw>(TABLES.users)
    .insert({
      [USER_COLUMNS.username]: username,
      [USER_COLUMNS.user_hash]: user_hash,
      [USER_COLUMNS.email]: email,
      [USER_COLUMNS.password_hash]: passwordHash,
    })
    .returning("*")
    .first();
}

export async function findMaxUserHash(username: string): Promise<number> {
  const maxUserHash = await db(TABLES.users)
    .max(USER_COLUMNS.user_hash)
    .where({ [USER_COLUMNS.username]: username })
    .first();

  if (!maxUserHash) {
    return 0;
  }

  if (maxUserHash.max === null) {
    return 0;
  }

  return maxUserHash.max;
}
