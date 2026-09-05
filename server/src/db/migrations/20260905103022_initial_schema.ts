import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.text("username").notNullable();
    table.integer("user_hash").notNullable();
    table.text("email").notNullable().unique();
    table.text("password_hash").notNullable();
    table
      .timestamp("created_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true });
    table.unique(["username", "user_hash"]);
  });

  await knex.schema.createTable("groups", (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.text("title").notNullable();
    table.uuid("creator_id").notNullable().references("id").inTable("users");
    table
      .timestamp("created_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("group_member", (table) => {
    table.uuid("group_id").notNullable().references("id").inTable("groups");
    table.uuid("member_id").notNullable().references("id").inTable("users");
    table.primary(["group_id", "member_id"]);
  });

  await knex.schema.createTable("wishlist", (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.text("title").notNullable();
    table.uuid("group_id").notNullable().references("id").inTable("groups");
    table.uuid("creator_id").notNullable().references("id").inTable("users");
    table
      .timestamp("created_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    table.boolean("is_deleted").notNullable().defaultTo(false);
  });

  await knex.raw(`
    CREATE TYPE statuses AS ENUM (
      'Новая',
      'Завершена'
    )
  `);

  await knex.schema.createTable("card", (table) => {
    table.increments("id").primary();
    table.text("title").notNullable();
    table
      .uuid("wishlist_id")
      .notNullable()
      .references("id")
      .inTable("wishlist");
    table.text("description").notNullable();
    table.specificType("status", "statuses").notNullable();
    table.uuid("creator_id").notNullable().references("id").inTable("users");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("card");

  await knex.raw(`
    DROP TYPE IF EXISTS statuses
  `);

  await knex.schema.dropTableIfExists("wishlist");
  await knex.schema.dropTableIfExists("group_member");
  await knex.schema.dropTableIfExists("groups");
  await knex.schema.dropTableIfExists("users");
}
