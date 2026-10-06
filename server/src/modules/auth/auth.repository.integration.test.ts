import { describe, expect, test } from "@jest/globals";

import {
  createUser,
  findUserByEmail,
  findUserByID,
  findMaxUserHash,
} from "./auth.repository.js";
import { createUser as createUserFixture } from "../../../tests/integration/fixtures/users.js";
import { db } from "../../db/knex.js";
import { TABLES, USER_COLUMNS } from "../../db/schema.js";
import type { UUID } from "../../types/shared.js";

describe("auth repository", () => {
  const missingID = "00000000-0000-0000-0000-000000000000" as UUID;

  describe("createUser", () => {
    test("success create user", async () => {
      const user = await createUser("Vlad", "vlad@example.com", "hashed-password", 1);

      expect(user).toBeDefined();
      const createdUser = await db(TABLES.users)
        .where(USER_COLUMNS.id, user!.id)
        .first();
      expect(createdUser).toMatchObject({
        [USER_COLUMNS.username]: "Vlad",
        [USER_COLUMNS.email]: "vlad@example.com",
        [USER_COLUMNS.password_hash]: "hashed-password",
        [USER_COLUMNS.user_hash]: 1,
        [USER_COLUMNS.created_at]: expect.any(Date),
        [USER_COLUMNS.updated_at]: null,
      });
    });

    test("throw when email already exists", async () => {
      await createUserFixture();

      await expect(createUser("Other", "vlad@example.com", "hash", 1))
        .rejects.toMatchObject({ code: "23505" });
    });

    test("throw when username and hash already exist", async () => {
      await createUserFixture();

      await expect(createUser("Vlad", "other@example.com", "hash", 123))
        .rejects.toMatchObject({ code: "23505" });
    });
  });

  describe("findUserByEmail", () => {
    test("returns undefined when email does not exist", async () => {
      await createUserFixture();

      const user = await findUserByEmail("missing@example.com");

      expect(user).toBeUndefined();
    });

    test("returns mapped user when email exists", async () => {
      const userID = await createUserFixture();

      const user = await findUserByEmail("vlad@example.com");

      expect(user).toEqual({
        id: userID,
        username: "Vlad",
        email: "vlad@example.com",
        passwordHash: "some strong password hash",
        userHash: 123,
      });
    });
  });

  describe("findUserByID", () => {
    test("returns undefined when user does not exist", async () => {
      const user = await findUserByID(missingID);

      expect(user).toBeUndefined();
    });

    test("returns user when ID exists", async () => {
      const userID = await createUserFixture();

      const user = await findUserByID(userID);

      expect(user).toEqual({
        id: userID,
        username: "Vlad",
        email: "vlad@example.com",
        password_hash: "some strong password hash",
        user_hash: 123,
      });
    });
  });

  describe("findMaxUserHash", () => {
    test("returns zero when username does not exist", async () => {
      await createUserFixture({ username: "Other" });

      const maxHash = await findMaxUserHash("Vlad");

      expect(maxHash).toBe(0);
    });

    test("returns maximum hash for requested username", async () => {
      await createUserFixture({ user_hash: 2 });
      await createUserFixture({ email: "second@example.com", user_hash: 5 });
      await createUserFixture(
        { username: "Other", email: "other@example.com", user_hash: 99 },
      );

      const maxHash = await findMaxUserHash("Vlad");

      expect(maxHash).toBe(5);
    });
  });
});
