import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import type { UUID } from "../../types/shared.js";
import type {
  AuthBlacklistServiceInterface,
  AuthRepositoryInterface,
  JwtRepositoryInterface,
  JwtServiceInterface,
} from "./auth.di.js";
import type {
  AccessTokenPayload,
  RefreshTokenPayload,
  User,
} from "./auth.types.js";
import type { RefreshTokenRaw, UserRaw } from "./auth.repository.dto.js";
import {
  CreateRefreshTokenData,
  RevokeRefreshTokenData,
  TokenData,
} from "./jwt.types.js";

// Мокаем функции
const findUserByEmailMock =
  jest.fn<(email: string) => Promise<User | undefined>>();
const findUserByIDMock = jest.fn<(id: UUID) => Promise<User>>();
const createUserMock =
  jest.fn<
    (
      username: string,
      email: string,
      passwordHash: string,
      user_hash: number,
    ) => Promise<UserRaw | undefined>
  >();
const findMaxUserHashMock = jest.fn<(username: string) => Promise<number>>();
class AuthRepository implements AuthRepositoryInterface {
  constructor(
    public readonly findUserByEmail: any,
    public readonly findUserByID: any,
    public readonly createUser: any,
    public readonly findMaxUserHash: any,
  ) {}
}
const authRepository = new AuthRepository(
  findUserByEmailMock,
  findUserByIDMock,
  createUserMock,
  findMaxUserHashMock,
);

const createRefreshTokenRecordMock =
  jest.fn<(data: CreateRefreshTokenData) => Promise<RefreshTokenRaw>>();
const findRefreshTokenByJtiMock =
  jest.fn<(jti: string) => Promise<RefreshTokenRaw | undefined>>();
const revokeRefreshTokenMock = jest.fn<(jti: string) => Promise<void>>();
const revokeAllUserRefreshTokensMock =
  jest.fn<(userId: UUID) => Promise<RevokeRefreshTokenData[]>>();
const deleteExpiredRefreshTokensMock = jest.fn<() => Promise<number>>();
class JwtRepository implements JwtRepositoryInterface {
  constructor(
    public readonly createRefreshTokenRecord: any,
    public readonly findRefreshTokenByJti: any,
    public readonly revokeRefreshToken: any,
    public readonly revokeAllUserRefreshTokens: any,
    public readonly deleteExpiredRefreshTokens: any,
  ) {}
}
const jwtRepository = new JwtRepository(
  createRefreshTokenRecordMock,
  findRefreshTokenByJtiMock,
  revokeRefreshTokenMock,
  revokeAllUserRefreshTokensMock,
  deleteExpiredRefreshTokensMock,
);

const createAccessTokenMock = jest.fn<(userID: UUID) => string>();
const createRefreshTokenMock = jest.fn<(userID: UUID) => TokenData>();
const verifyAccessToken = jest.fn<(token: string) => AccessTokenPayload>();
const verifyRefreshTokenMock =
  jest.fn<(token: string) => RefreshTokenPayload>();
class JwtService implements JwtServiceInterface {
  constructor(
    public readonly createAccessToken: any,
    public readonly createRefreshToken: any,
    public readonly verifyAccessToken: any,
    public readonly verifyRefreshToken: any,
  ) {}
}
const jwtService = new JwtService(
  createAccessTokenMock,
  createRefreshTokenMock,
  verifyAccessToken,
  verifyRefreshTokenMock,
);

const isRefreshBlacklistedMock = jest.fn<(jti: string) => Promise<boolean>>();
const blacklistRefreshTokenMock =
  jest.fn<(jti: string, expiresAt: number) => Promise<void>>();
class AuthBlacklistService implements AuthBlacklistServiceInterface {
  constructor(
    public readonly isRefreshBlacklisted: any,
    public readonly blacklistRefreshToken: any,
  ) {}
}
const authBlacklistService = new AuthBlacklistService(
  isRefreshBlacklistedMock,
  blacklistRefreshTokenMock,
);

const hashMock =
  jest.fn<(password: string, rounds: number) => Promise<string>>();
const compareMock =
  jest.fn<(password: string, hashed: string) => Promise<boolean>>();

// Мокаем импорты этих функций
jest.unstable_mockModule("bcrypt", () => ({
  default: { hash: hashMock, compare: compareMock },
}));
jest.unstable_mockModule("../../config/env.js", () => ({
  config: { auth: { bcryptRounds: 12 } },
}));

// Импорт тестируемых модулей после подмены импортов на моки
let authService: any;
beforeAll(async () => {
  const service = await import("./auth.service.js");
  authService = new service.AuthService(
    authRepository,
    jwtService,
    jwtRepository,
    authBlacklistService,
  );
});

describe("auth service", () => {
  const userID = "00000000-0000-0000-0000-000000000001" as UUID;
  const user = {
    id: userID,
    username: "Vlad",
    email: "vlad@example.com",
    userHash: "3",
    passwordHash: "hashed",
  };
  const registration = {
    username: user.username,
    email: user.email,
    password: "password",
  };
  const expiresAt = new Date("2030-01-01T00:00:00Z");
  const session = {
    id: userID,
    user_id: userID,
    jti: "old-jti",
    created_at: new Date(),
    expires_at: expiresAt,
    revoked_at: null,
    user_agent: "Browser",
  };

  describe("registerUser", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      createAccessTokenMock.mockReturnValue("access");
      createRefreshTokenMock.mockReturnValue({
        token: "refresh",
        jti: "00000000-0000-0000-0000-000000000003",
      });
      verifyRefreshTokenMock.mockImplementation((token) => ({
        type: "refresh",
        sub: userID,
        jti:
          token === "refresh"
            ? "00000000-0000-0000-0000-000000000003"
            : "old-jti",
        exp: expiresAt.getTime() / 1000,
      }));
    });

    test("rejects duplicate email before hashing", async () => {
      findUserByEmailMock.mockResolvedValue(user);

      await expect(registerUser(registration)).rejects.toThrow(
        "User with this email already exists",
      );

      expect(findUserByEmailMock).toHaveBeenCalledWith(user.email);
      expect(hashMock).not.toHaveBeenCalled();
      expect(createUserMock).not.toHaveBeenCalled();
    });

    test("registers with hashed password and next username hash", async () => {
      hashMock.mockResolvedValue("hashed");
      findMaxUserHashMock.mockResolvedValue(2);
      createUserMock.mockResolvedValue({ id: userID } as Awaited<
        ReturnType<Users["createUser"]>
      >);

      await expect(registerUser(registration, "Browser")).resolves.toEqual({
        accessToken: "access",
        refreshToken: "refresh",
      });

      expect(hashMock).toHaveBeenCalledWith("password", 12);
      expect(findMaxUserHashMock).toHaveBeenCalledWith("Vlad");
      expect(createUserMock).toHaveBeenCalledWith(
        "Vlad",
        user.email,
        "hashed",
        3,
      );
      expect(createAccessTokenMock).toHaveBeenCalledWith(userID);
      expect(createRefreshTokenMock).toHaveBeenCalledWith(userID);
      expect(createRefreshTokenRecordMock).toHaveBeenCalledWith({
        userId: userID,
        jti: "00000000-0000-0000-0000-000000000003",
        expiresAt,
        userAgent: "Browser",
      });
    });

    test("rejects failed user creation without issuing tokens", async () => {
      findMaxUserHashMock.mockResolvedValue(0);

      await expect(registerUser(registration)).rejects.toThrow(
        "Can't create user",
      );

      expect(createAccessTokenMock).not.toHaveBeenCalled();
    });
  });

  describe("loginUser", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      createAccessTokenMock.mockReturnValue("access");
      createRefreshTokenMock.mockReturnValue({
        token: "refresh",
        jti: "00000000-0000-0000-0000-000000000003",
      });
      verifyRefreshTokenMock.mockImplementation((token) => ({
        type: "refresh",
        sub: userID,
        jti:
          token === "refresh"
            ? "00000000-0000-0000-0000-000000000003"
            : "old-jti",
        exp: expiresAt.getTime() / 1000,
      }));
    });

    test("rejects unknown login email", async () => {
      await expect(loginUser(registration)).rejects.toThrow("Invalid email");

      expect(compareMock).not.toHaveBeenCalled();
    });

    test("rejects incorrect password", async () => {
      findUserByEmailMock.mockResolvedValue(user);
      compareMock.mockResolvedValue(false);

      await expect(loginUser(registration)).rejects.toThrow(
        "Invalid password for this email",
      );

      expect(compareMock).toHaveBeenCalledWith("password", "hashed");
      expect(createRefreshTokenRecordMock).not.toHaveBeenCalled();
    });

    test("logs in and persists refresh session without user agent", async () => {
      findUserByEmailMock.mockResolvedValue(user);
      compareMock.mockResolvedValue(true);

      await expect(loginUser(registration)).resolves.toEqual({
        accessToken: "access",
        refreshToken: "refresh",
      });

      expect(createAccessTokenMock).toHaveBeenCalledWith(userID);
      expect(createRefreshTokenMock).toHaveBeenCalledWith(userID);
      expect(createRefreshTokenRecordMock).toHaveBeenCalledWith({
        userId: userID,
        jti: "00000000-0000-0000-0000-000000000003",
        expiresAt,
        userAgent: undefined,
      });
    });
  });

  describe("refreshTokens", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      createAccessTokenMock.mockReturnValue("access");
      createRefreshTokenMock.mockReturnValue({
        token: "refresh",
        jti: "00000000-0000-0000-0000-000000000003",
      });
      verifyRefreshTokenMock.mockImplementation((token) => ({
        type: "refresh",
        sub: userID,
        jti:
          token === "refresh"
            ? "00000000-0000-0000-0000-000000000003"
            : "old-jti",
        exp: expiresAt.getTime() / 1000,
      }));
    });

    test("rejects blacklisted refresh before reading session", async () => {
      isRefreshBlacklistedMock.mockResolvedValue(true);

      await expect(refreshTokens("old")).rejects.toThrow(
        "Refresh token revoked",
      );

      expect(isRefreshBlacklistedMock).toHaveBeenCalledWith("old-jti");
      expect(findRefreshTokenByJtiMock).not.toHaveBeenCalled();
    });

    test("refreshTokens rejects missing session", async () => {
      await expect(refreshTokens("old")).rejects.toThrow(
        "Refresh token session not found",
      );

      expect(findRefreshTokenByJtiMock).toHaveBeenCalledWith("old-jti");
      expect(revokeRefreshTokenMock).not.toHaveBeenCalled();
      expect(revokeAllUserRefreshTokensMock).not.toHaveBeenCalled();
      expect(blacklistRefreshTokenMock).not.toHaveBeenCalled();
    });

    test("rejects revoked refresh", async () => {
      findRefreshTokenByJtiMock.mockResolvedValue({
        ...session,
        revoked_at: new Date(),
      });

      await expect(refreshTokens("old")).rejects.toThrow(
        "Refresh token revoked",
      );

      expect(createRefreshTokenRecordMock).not.toHaveBeenCalled();
      expect(blacklistRefreshTokenMock).not.toHaveBeenCalled();
    });

    test("rotates refresh and preserves user agent Browser", async () => {
      findRefreshTokenByJtiMock.mockResolvedValue({
        ...session,
        user_agent: "Browser",
      });

      await expect(refreshTokens("old")).resolves.toEqual({
        accessToken: "access",
        refreshToken: "refresh",
      });

      expect(blacklistRefreshTokenMock).toHaveBeenCalledWith(
        "old-jti",
        expiresAt.getTime() / 1000,
      );
      expect(revokeRefreshTokenMock).toHaveBeenCalledWith("old-jti");
      expect(createAccessTokenMock).toHaveBeenCalledWith(userID);
      expect(createRefreshTokenMock).toHaveBeenCalledWith(userID);
      expect(createRefreshTokenRecordMock).toHaveBeenCalledWith({
        userId: userID,
        jti: "00000000-0000-0000-0000-000000000003",
        expiresAt,
        userAgent: "Browser",
      });
    });

    test("rotates refresh and preserves user agent null", async () => {
      findRefreshTokenByJtiMock.mockResolvedValue({
        ...session,
        user_agent: null,
      });

      await expect(refreshTokens("old")).resolves.toEqual({
        accessToken: "access",
        refreshToken: "refresh",
      });

      expect(blacklistRefreshTokenMock).toHaveBeenCalledWith(
        "old-jti",
        expiresAt.getTime() / 1000,
      );
      expect(revokeRefreshTokenMock).toHaveBeenCalledWith("old-jti");
      expect(createAccessTokenMock).toHaveBeenCalledWith(userID);
      expect(createRefreshTokenMock).toHaveBeenCalledWith(userID);
      expect(createRefreshTokenRecordMock).toHaveBeenCalledWith({
        userId: userID,
        jti: "00000000-0000-0000-0000-000000000003",
        expiresAt,
        userAgent: undefined,
      });
    });

    test("refreshTokens propagates invalid token before repository calls", async () => {
      verifyRefreshTokenMock.mockImplementation(() => {
        throw new Error("Invalid token");
      });
      await expect(refreshTokens("invalid")).rejects.toThrow("Invalid token");

      expect(findRefreshTokenByJtiMock).not.toHaveBeenCalled();
    });
  });

  describe("logoutUser", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      createAccessTokenMock.mockReturnValue("access");
      createRefreshTokenMock.mockReturnValue({
        token: "refresh",
        jti: "00000000-0000-0000-0000-000000000003",
      });
      verifyRefreshTokenMock.mockImplementation((token) => ({
        type: "refresh",
        sub: userID,
        jti:
          token === "refresh"
            ? "00000000-0000-0000-0000-000000000003"
            : "old-jti",
        exp: expiresAt.getTime() / 1000,
      }));
    });

    test("logoutUser rejects missing session", async () => {
      await expect(logoutUser("old")).rejects.toThrow(
        "Refresh token session not found",
      );

      expect(findRefreshTokenByJtiMock).toHaveBeenCalledWith("old-jti");
      expect(revokeRefreshTokenMock).not.toHaveBeenCalled();
      expect(revokeAllUserRefreshTokensMock).not.toHaveBeenCalled();
      expect(blacklistRefreshTokenMock).not.toHaveBeenCalled();
    });

    test("logout revokes and blacklists refresh", async () => {
      findRefreshTokenByJtiMock.mockResolvedValue(session);

      await logoutUser("old");

      expect(revokeRefreshTokenMock).toHaveBeenCalledWith("old-jti");
      expect(blacklistRefreshTokenMock).toHaveBeenCalledWith(
        "old-jti",
        expiresAt.getTime() / 1000,
      );
    });

    test("logout is idempotent for revoked session", async () => {
      findRefreshTokenByJtiMock.mockResolvedValue({
        ...session,
        revoked_at: new Date(),
      });

      await logoutUser("old");

      expect(revokeRefreshTokenMock).not.toHaveBeenCalled();
      expect(blacklistRefreshTokenMock).not.toHaveBeenCalled();
    });

    test("logoutUser propagates invalid token before repository calls", async () => {
      verifyRefreshTokenMock.mockImplementation(() => {
        throw new Error("Invalid token");
      });
      await expect(logoutUser("invalid")).rejects.toThrow("Invalid token");

      expect(findRefreshTokenByJtiMock).not.toHaveBeenCalled();
    });
  });

  describe("revokeAllUserRefresh", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      createAccessTokenMock.mockReturnValue("access");
      createRefreshTokenMock.mockReturnValue({
        token: "refresh",
        jti: "00000000-0000-0000-0000-000000000003",
      });
      verifyRefreshTokenMock.mockImplementation((token) => ({
        type: "refresh",
        sub: userID,
        jti:
          token === "refresh"
            ? "00000000-0000-0000-0000-000000000003"
            : "old-jti",
        exp: expiresAt.getTime() / 1000,
      }));
    });

    test("revokeAllUserRefresh rejects missing session", async () => {
      await expect(revokeAllUserRefresh("old")).rejects.toThrow(
        "Refresh token session not found",
      );

      expect(findRefreshTokenByJtiMock).toHaveBeenCalledWith("old-jti");
      expect(revokeRefreshTokenMock).not.toHaveBeenCalled();
      expect(revokeAllUserRefreshTokensMock).not.toHaveBeenCalled();
      expect(blacklistRefreshTokenMock).not.toHaveBeenCalled();
    });

    test("revokes all sessions of the session owner", async () => {
      findRefreshTokenByJtiMock.mockResolvedValue(session);
      revokeAllUserRefreshTokensMock.mockResolvedValue([
        { jti: "first", expires_at: 1900000000 },
        { jti: "second", expires_at: 1900000100 },
      ]);

      await revokeAllUserRefresh("old");

      expect(revokeAllUserRefreshTokensMock).toHaveBeenCalledWith(userID);
      expect(blacklistRefreshTokenMock).toHaveBeenCalledTimes(2);
      expect(blacklistRefreshTokenMock).toHaveBeenCalledWith(
        "first",
        1900000000,
      );
      expect(blacklistRefreshTokenMock).toHaveBeenCalledWith(
        "second",
        1900000100,
      );
    });

    test("revokeAllUserRefresh propagates invalid token before repository calls", async () => {
      verifyRefreshTokenMock.mockImplementation(() => {
        throw new Error("Invalid token");
      });
      await expect(revokeAllUserRefresh("invalid")).rejects.toThrow(
        "Invalid token",
      );

      expect(findRefreshTokenByJtiMock).not.toHaveBeenCalled();
    });
  });

  describe("getUserData", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      createAccessTokenMock.mockReturnValue("access");
      createRefreshTokenMock.mockReturnValue({
        token: "refresh",
        jti: "00000000-0000-0000-0000-000000000003",
      });
      verifyRefreshTokenMock.mockImplementation((token) => ({
        type: "refresh",
        sub: userID,
        jti:
          token === "refresh"
            ? "00000000-0000-0000-0000-000000000003"
            : "old-jti",
        exp: expiresAt.getTime() / 1000,
      }));
    });

    test("returns current user", async () => {
      findUserByIDMock.mockResolvedValue(user);

      await expect(getUserData(userID)).resolves.toEqual(user);

      expect(findUserByIDMock).toHaveBeenCalledWith(userID);
    });

    test("rejects missing current user", async () => {
      await expect(getUserData(userID)).rejects.toThrow(
        "Refresh token session not found",
      );
    });
  });
});
