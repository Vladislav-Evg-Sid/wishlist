import type { Knex } from "knex";
import { TABLES, USER_COLUMNS } from "../schema.ts";

export async function seed(knex: Knex): Promise<void> {
  await knex(TABLES.card).del();
  await knex(TABLES.wishlist).del();
  await knex(TABLES.group_member).del();
  await knex(TABLES.groups).del();
  await knex(TABLES.users).del();

  await knex(TABLES.users).insert([
    {
      [USER_COLUMNS.id]: "00000000-0000-0000-0000-000000000000",
      [USER_COLUMNS.username]: "Влад",
      [USER_COLUMNS.user_hash]: 1,
      [USER_COLUMNS.email]: "vlad@mail.ru",
      [USER_COLUMNS.password_hash]: "test",
    },
  ]);
}
