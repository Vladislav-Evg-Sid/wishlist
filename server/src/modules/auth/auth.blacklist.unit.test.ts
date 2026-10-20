import {
  beforeAll,
  beforeEach,
  afterEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import type { redisServiceAuthInterface } from "../../infrastructure/redis/redis.di.js";

// Мокаем функции
const setValueMock =
  jest.fn<
    (prefix: string, key: string, value: any, ttl?: number) => Promise<void>
  >();
const valueIsExistMock =
  jest.fn<(prefix: string, key: string) => Promise<any>>();
class RedisService implements redisServiceAuthInterface {
  constructor(
    readonly setValue: (
      prefix: string,
      key: string,
      value: any,
      ttl?: number,
    ) => Promise<void>,
    readonly valueIsExist: (prefix: string, key: string) => Promise<any>,
  ) {}
}

const redisService = new RedisService(setValueMock, valueIsExistMock);

// Импорт тестируемых модулей после подмены импортов на моки
let blacklistService: import("./auth.blacklist.js").AuthBlacklistService;
beforeAll(async () => {
  const service = await import("./auth.blacklist.js");
  blacklistService = new service.AuthBlacklistService(redisService);
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
      valueIsExistMock.mockResolvedValue(0);

      await expect(blacklistService.isRefreshBlacklisted("jti")).resolves.toBe(
        false,
      );

      expect(valueIsExistMock).toHaveBeenCalledWith("reft:bl", "jti");
    });

    test("maps redis exists 1 to true", async () => {
      valueIsExistMock.mockResolvedValue(1);

      await expect(blacklistService.isRefreshBlacklisted("jti")).resolves.toBe(
        true,
      );

      expect(valueIsExistMock).toHaveBeenCalledWith("reft:bl", "jti");
    });

    test("propagates Redis lookup errors", async () => {
      const error = new Error("Redis unavailable");
      valueIsExistMock.mockRejectedValue(error);

      await expect(blacklistService.isRefreshBlacklisted("jti")).rejects.toBe(
        error,
      );

      expect(valueIsExistMock).toHaveBeenCalledWith("reft:bl", "jti");
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
      await blacklistService.blacklistRefreshToken(
        "jti",
        Date.now() / 1000 + 60,
      );

      expect(setValueMock).toHaveBeenCalledWith("reft:bl", "jti", "1", 60);
    });

    test("does not store expired refresh (offset 0)", async () => {
      await blacklistService.blacklistRefreshToken("jti", Date.now() / 1000);

      expect(setValueMock).not.toHaveBeenCalled();
    });

    test("does not store expired refresh (offset -1)", async () => {
      await blacklistService.blacklistRefreshToken(
        "jti",
        Date.now() / 1000 - 1,
      );

      expect(setValueMock).not.toHaveBeenCalled();
    });

    test("propagates Redis errors", async () => {
      setValueMock.mockRejectedValue(new Error("Redis unavailable"));
      await expect(
        blacklistService.blacklistRefreshToken("jti", Date.now() / 1000 + 60),
      ).rejects.toThrow("Redis unavailable");
    });
  });
});
