import { db } from "../../../src/db/knex.js";
import {
  GROUPS_COLUMNS,
  TABLES,
  USER_COLUMNS,
} from "../../../src/db/schema.js";

export async function createUser(): Promise<string> {
  const userIDs = await db(TABLES.users)
    .insert({
      [USER_COLUMNS.username]: "Vlad",
      [USER_COLUMNS.user_hash]: 123,
      [USER_COLUMNS.email]: "vlad@example.com",
      [USER_COLUMNS.password_hash]: "some strong password hash",
    })
    .returning(USER_COLUMNS.id);
  return userIDs[0][GROUPS_COLUMNS.id];
}
