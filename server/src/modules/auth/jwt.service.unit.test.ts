import {
  beforeAll,
  afterEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import jwt from "jsonwebtoken";
import type { UUID } from "../../types/shared.js";

const config = {
  jwt: {
    accessSecret: "unit-access-secret",
    refreshSecret: "unit-refresh-secret",
    accessTTL: "15m",
    refreshTTL: "7d",
  },
};

// Мокаем импорты этих функций
jest.unstable_mockModule("../../config/env.js", () => ({ config }));

// Импорт тестируемых модулей после подмены импортов на моки
type JwtService = typeof import("./jwt.service.js");

let createAccessToken: JwtService["createAccessToken"];
let createRefreshToken: JwtService["createRefreshToken"];
let verifyAccessToken: JwtService["verifyAccessToken"];
let verifyRefreshToken: JwtService["verifyRefreshToken"];
beforeAll(async () => {
  const service = await import("./jwt.service.js");

  createAccessToken = service.createAccessToken;
  createRefreshToken = service.createRefreshToken;
  verifyAccessToken = service.verifyAccessToken;
  verifyRefreshToken = service.verifyRefreshToken;
});

describe("jwt service", () => {
  const userID = "00000000-0000-0000-0000-000000000001" as UUID;

  describe("createAccessToken", () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    test("creates and verifies access token with configured TTL", () => {
      const token = createAccessToken(userID);
      const payload = verifyAccessToken(token);
      expect(payload).toMatchObject({
        sub: userID,
        type: "access",
        iat: expect.any(Number),
        exp: expect.any(Number),
      });
      expect(payload.exp! - payload.iat!).toBe(15 * 60);
    });
  });

  describe("createRefreshToken", () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    test("creates refresh tokens with unique jti and configured TTL", () => {
      const first = createRefreshToken(userID);
      const second = createRefreshToken(userID);
      expect(first.jti).not.toBe(second.jti);
      const payload = verifyRefreshToken(first.token);
      expect(payload).toMatchObject({ sub: userID, type: "refresh", jti: first.jti });
      expect(payload.exp - payload.iat!).toBe(7 * 86400);
    });
  });

  describe("verifyAccessToken", () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    test("rejects malformed, incorrectly signed and expired access tokens", () => {
      expect(() => verifyAccessToken("invalid")).toThrow();
      expect(
        () => verifyAccessToken(
          jwt.sign(
            { type: "access" },
            "wrong-secret",
            { subject: userID, expiresIn: "1h" },
          ),
        ),
      ).toThrow();
      jest.useFakeTimers();
      const token = createAccessToken(userID);
      jest.setSystemTime(Date.now() + 8 * 86400 * 1000);
      expect(() => verifyAccessToken(token)).toThrow("jwt expired");
    });

    test("rejects string access payload", () => {
      const secret = config.jwt.accessSecret;
      expect(() => verifyAccessToken(jwt.sign("string payload", secret))).toThrow(
        "Invalid access token payload",
      );
    });

    test("throw when access token has refresh type", () => {
      expect(
        () => verifyAccessToken(
          jwt.sign({ type: "refresh", sub: userID }, config.jwt.accessSecret),
        ),
      ).toThrow(
        "Invalid access token",
      );
    });

    test("throw when access token has no subject", () => {
      expect(
        () => verifyAccessToken(jwt.sign({ type: "access" }, config.jwt.accessSecret)),
      ).toThrow(
        "Invalid access token",
      );
    });
  });

  describe("verifyRefreshToken", () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    test("rejects malformed, incorrectly signed and expired refresh tokens", () => {
      expect(() => verifyRefreshToken("invalid")).toThrow();
      expect(
        () => verifyRefreshToken(
          jwt.sign(
            { type: "refresh" },
            "wrong-secret",
            { subject: userID, expiresIn: "1h" },
          ),
        ),
      ).toThrow();
      jest.useFakeTimers();
      const token = createRefreshToken(userID).token;
      jest.setSystemTime(Date.now() + 8 * 86400 * 1000);
      expect(() => verifyRefreshToken(token)).toThrow("jwt expired");
    });

    test("rejects string refresh payload", () => {
      const secret = config.jwt.refreshSecret;
      expect(() => verifyRefreshToken(jwt.sign("string payload", secret))).toThrow(
        "Invalid refresh token payload",
      );
    });

    test("throw when refresh token has access type", () => {
      expect(
        () => verifyRefreshToken(
          jwt.sign(
            { type: "access", sub: userID, jti: "jti", exp: 2000000000 },
            config.jwt.refreshSecret,
          ),
        ),
      ).toThrow(
        "Invalid refresh token",
      );
    });

    test("throw when refresh token has no subject", () => {
      expect(
        () => verifyRefreshToken(
          jwt.sign(
            { type: "refresh", jti: "jti", exp: 2000000000 },
            config.jwt.refreshSecret,
          ),
        ),
      ).toThrow(
        "Invalid refresh token",
      );
    });

    test("throw when refresh token has no jti", () => {
      expect(
        () => verifyRefreshToken(
          jwt.sign(
            { type: "refresh", sub: userID, exp: 2000000000 },
            config.jwt.refreshSecret,
          ),
        ),
      ).toThrow(
        "Invalid refresh token",
      );
    });

    test("throw when refresh token has no expiration", () => {
      expect(
        () => verifyRefreshToken(
          jwt.sign({ type: "refresh", sub: userID, jti: "jti" }, config.jwt.refreshSecret),
        ),
      ).toThrow(
        "Invalid refresh token",
      );
    });
  });
});
