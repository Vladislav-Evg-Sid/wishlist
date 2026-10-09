import type { UUID } from "../../types/shared.js";
import type { RefreshTokenRaw, UserRaw } from "./auth.repository.dto.js";
import type {
  AccessTokenPayload,
  RefreshTokenPayload,
  Tokens,
  User,
  UserData,
  UserLoginData,
  UserRegisterData,
} from "./auth.types.js";
import type {
  CreateRefreshTokenData,
  RevokeRefreshTokenData,
  TokenData,
} from "./jwt.types.js";

export const JWT_REPOSITORY = Symbol("JWT_REPOSITORY");

export interface JwtRepositoryInterface {
  createRefreshTokenRecord(
    data: CreateRefreshTokenData,
  ): Promise<RefreshTokenRaw>;
  findRefreshTokenByJti(jti: string): Promise<RefreshTokenRaw | undefined>;
  revokeRefreshToken(jti: string): Promise<void>;
  revokeAllUserRefreshTokens(userId: UUID): Promise<RevokeRefreshTokenData[]>;
  deleteExpiredRefreshTokens(): Promise<number>;
}

export const JWT_SERVICE = Symbol("JWT_SERVICE");

export interface JwtServiceInterface {
  createAccessToken(userID: UUID): string;
  createRefreshToken(userID: UUID): TokenData;
  verifyAccessToken(token: string): AccessTokenPayload;
  verifyRefreshToken(token: string): RefreshTokenPayload;
}

export const AUTH_REPOSITORY = Symbol("AUTH_REPOSITORY");

export interface AuthRepositoryInterface {
  findUserByEmail(email: string): Promise<User | undefined>;
  findUserByID(id: UUID): Promise<User>;
  createUser(
    username: string,
    email: string,
    passwordHash: string,
    user_hash: number,
  ): Promise<UserRaw | undefined>;
  findMaxUserHash(username: string): Promise<number>;
}

export const AUTH_SERVICE = Symbol("AUTH_SERVICE");

export interface AuthServiceInterface {
  refreshTokens(refreshToken: string): Promise<Tokens>;
  registerUser(
    { email, username, password }: UserRegisterData,
    userAgent?: string,
  ): Promise<Tokens>;
  loginUser(
    { email, password }: UserLoginData,
    userAgent?: string,
  ): Promise<Tokens>;
  logoutUser(refreshToken: string): Promise<void>;
  revokeAllUserRefresh(refreshToken: string): Promise<void>;
  getUserData(userID: UUID): Promise<UserData>;
}

export const AUTH_BLACKLIST_SERVICE = Symbol("AUTH_BLACKLIST_SERVICE");

export interface AuthBlacklistServiceInterface {
  isRefreshBlacklisted(jti: string): Promise<boolean>;
  blacklistRefreshToken(jti: string, expiresAt: number): Promise<void>;
}
