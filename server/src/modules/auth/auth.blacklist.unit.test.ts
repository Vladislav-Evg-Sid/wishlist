import {
  beforeAll,
  beforeEach,
  afterEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

// Мокаем функции
const existsMock = jest.fn<(key: string) => Promise<number>>();
const setMock =
  jest.fn<(key: string, value: string, options: {
    EX: number;
  }) => Promise<unknown>>();

// Мокаем импорты этих функций
jest.unstable_mockModule("../../redis/redis.js", () => ({ redis: { exists: existsMock, set: setMock } }));

// Импорт тестируемых модулей после подмены импортов на моки
type AuthBlacklist = typeof import("./auth.blacklist.js");

let isRefreshBlacklisted: AuthBlacklist["isRefreshBlacklisted"];
let blacklistRefreshToken: AuthBlacklist["blacklistRefreshToken"];
beforeAll(async () => {
  const service = await import("./auth.blacklist.js");

  isRefreshBlacklisted = service.isRefreshBlacklisted;
  blacklistRefreshToken = service.blacklistRefreshToken;
});

describe("auth blacklist", () => {
  describe("isRefreshBlacklisted", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("maps redis exists 0 to false", async () => {
      existsMock.mockResolvedValue(0);

      await expect(isRefreshBlacklisted("jti")).resolves.toBe(false);

      expect(existsMock).toHaveBeenCalledWith("reft:bl:jti");
    });

    test("maps redis exists 1 to true", async () => {
      existsMock.mockResolvedValue(1);

      await expect(isRefreshBlacklisted("jti")).resolves.toBe(true);

      expect(existsMock).toHaveBeenCalledWith("reft:bl:jti");
    });
  });

  describe("blacklistRefreshToken", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("stores refresh blacklist with remaining TTL", async () => {
      await blacklistRefreshToken("jti", Date.now() / 1000 + 60);

      expect(setMock).toHaveBeenCalledWith("reft:bl:jti", "1", { EX: 60 });
    });

    test("does not store expired refresh (offset 0)", async () => {
      await blacklistRefreshToken("jti", Date.now() / 1000);

      expect(setMock).not.toHaveBeenCalled();
    });

    test("does not store expired refresh (offset -1)", async () => {
      await blacklistRefreshToken("jti", Date.now() / 1000 - 1);

      expect(setMock).not.toHaveBeenCalled();
    });

    test("propagates Redis errors", async () => {
      setMock.mockRejectedValue(new Error("Redis unavailable"));
      await expect(blacklistRefreshToken("jti", Date.now() / 1000 + 60)).rejects.toThrow(
        "Redis unavailable",
      );
    });
  });
});
