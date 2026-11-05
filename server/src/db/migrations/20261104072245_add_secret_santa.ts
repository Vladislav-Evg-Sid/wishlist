import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TYPE secret_santa_status AS ENUM (
      'create-team',
      'finding-gift',
      'gift-ready',
      'delivery'
    )
  `);

  await knex.schema.createTable("secret_santa_team", (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.text("title").notNullable();
    table.uuid("creator_id").notNullable().references("id").inTable("users");
    table
      .specificType("stage", "secret_santa_status")
      .notNullable()
      .defaultTo("create-team");
    table.date("delivery_date").notNullable();
    table
      .timestamp("created_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("secret_santa_members", (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table
      .uuid("recipient_id")
      .nullable()
      .references("id")
      .inTable("secret_santa_members");
    table.uuid("member_id").notNullable().references("id").inTable("users");
    table
      .uuid("team_id")
      .notNullable()
      .references("id")
      .inTable("secret_santa_team");
    table.boolean("is_gift_prepaired").notNullable().defaultTo(false);
  });

  await knex.schema.createTable("secret_santa_member_wish", (table) => {
    table
      .uuid("member_id")
      .notNullable()
      .references("id")
      .inTable("secret_santa_members");
    table.integer("wish_id").notNullable().references("id").inTable("card");
    table.primary(["member_id", "wish_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("secret_santa_member_wish");
  await knex.schema.dropTableIfExists("secret_santa_members");
  await knex.schema.dropTableIfExists("secret_santa_team");
  await knex.raw(`DROP TYPE IF EXISTS secret_santa_status`);
}
