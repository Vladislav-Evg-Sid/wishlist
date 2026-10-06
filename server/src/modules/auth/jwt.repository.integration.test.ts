import { describe, expect, test } from "@jest/globals";

import {
  createRefreshTokenRecord,
  findRefreshTokenByJti,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
  deleteExpiredRefreshTokens,
} from "./jwt.repository.js";
import { createRefreshToken } from "../../../tests/integration/fixtures/refreshTokens.js";
import { createUser } from "../../../tests/integration/fixtures/users.js";
import { db } from "../../db/knex.js";
import { TABLES } from "../../db/schema.js";
import type { UUID } from "../../types/shared.js";


describe("jwt repository", () => {
  const missingID = "00000000-0000-0000-0000-000000000000" as UUID;

  describe("createRefreshTokenRecord", () => {
    test("persists and finds session with user agent Browser", async () => {
      const userId = await createUser();
      const expiresAt = new Date("2030-01-01T00:00:00Z");
      const record = await createRefreshTokenRecord(
        { userId, jti: "jti", expiresAt, userAgent: "Browser" },
      );

      expect(record).toMatchObject({
        id: expect.any(String),
        user_id: userId,
        jti: "jti",
        expires_at: expiresAt,
        revoked_at: null,
        user_agent: "Browser",
        created_at: expect.any(Date),
      });
      await expect(findRefreshTokenByJti("jti")).resolves.toEqual(record);
    });

    test("persists and finds session with user agent undefined", async () => {
      const userId = await createUser();
      const expiresAt = new Date("2030-01-01T00:00:00Z");
      const record = await createRefreshTokenRecord(
        { userId, jti: "jti", expiresAt, userAgent: undefined },
      );

      expect(record).toMatchObject({
        id: expect.any(String),
        user_id: userId,
        jti: "jti",
        expires_at: expiresAt,
        revoked_at: null,
        user_agent: null,
        created_at: expect.any(Date),
      });
      await expect(findRefreshTokenByJti("jti")).resolves.toEqual(record);
    });

    test("throw when user does not exist", async () => {
      await expect(
        createRefreshTokenRecord(
          {
            userId: missingID,
            jti: "missing",
            expiresAt: new Date("2030-01-01T00:00:00Z"),
            userAgent: undefined,
          },
        ),
      ).rejects.toMatchObject(
        { code: "23503" },
      );
    });

    test("throw when jti already exists", async () => {
      const userId = await createUser();
      await createRefreshToken(userId, "duplicate");
      await expect(
        createRefreshTokenRecord(
          {
            userId,
            jti: "duplicate",
            expiresAt: new Date("2030-01-01T00:00:00Z"),
            userAgent: undefined,
          },
        ),
      ).rejects.toMatchObject(
        { code: "23505" },
      );
    });
  });

  describe("findRefreshTokenByJti", () => {
    test("returns undefined for missing session", async () => {
      await expect(findRefreshTokenByJti("missing")).resolves.toBeUndefined();
    });

    test("returns session when jti exists", async () => {
      const userID = await createUser();
      const record = await createRefreshToken(userID, "jti");

      const refreshToken = await findRefreshTokenByJti("jti");

      expect(refreshToken).toEqual(record);
    });
  });

  describe("revokeRefreshToken", () => {
    test("revokes only requested session and ignores unknown jti", async () => {
      const userId = await createUser();
      await createRefreshToken(userId, "first");
      await createRefreshToken(userId, "second");
      await revokeRefreshToken("first");
      await revokeRefreshToken("missing");

      expect((await findRefreshTokenByJti("first"))!.revoked_at).toBeInstanceOf(Date);

      expect((await findRefreshTokenByJti("second"))!.revoked_at).toBeNull();
    });
  });

  describe("revokeAllUserRefreshTokens", () => {
    test("revokes only active sessions of requested user", async () => {
      const userId = await createUser();
      const otherId = await createUser({ username: "Other", email: "other@example.com" });
      const first = await createRefreshToken(userId, "first");
      const second = await createRefreshToken(userId, "second");
      await createRefreshToken(userId, "revoked");
      await revokeRefreshToken("revoked");
      const revoked = await findRefreshTokenByJti("revoked");
      await createRefreshToken(otherId, "other");
      const result = await revokeAllUserRefreshTokens(userId);

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining(
          [{ jti: "first", expires_at: first.expires_at }, { jti: "second", expires_at: second.expires_at }],
        ),
      );
      expect((await findRefreshTokenByJti("first"))!.revoked_at).toBeInstanceOf(Date);

      expect((await findRefreshTokenByJti("second"))!.revoked_at).toBeInstanceOf(Date);

      expect((await findRefreshTokenByJti("other"))!.revoked_at).toBeNull();

      expect((await findRefreshTokenByJti("revoked"))!.revoked_at).toEqual(
        revoked!.revoked_at,
      );
      await expect(revokeAllUserRefreshTokens(userId)).resolves.toEqual([]);
    });
  });

  describe("deleteExpiredRefreshTokens", () => {
    test("deletes expired sessions, preserving future sessions", async () => {
      const userId = await createUser();
      await createRefreshToken(userId, "expired", new Date(Date.now() - 3600000));
      await createRefreshToken(userId, "active");
      await expect(deleteExpiredRefreshTokens()).resolves.toBe(1);
      await expect(findRefreshTokenByJti("expired")).resolves.toBeUndefined();

      expect(await db(TABLES.refresh_tokens).select("jti")).toEqual(
        [{ jti: "active" }],
      );
      await expect(deleteExpiredRefreshTokens()).resolves.toBe(0);
    });
  });
});
