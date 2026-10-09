import { Inject, Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";

import { config } from "../../config/env.js";
import type {
  Tokens,
  UserData,
  UserLoginData,
  UserRegisterData,
} from "./auth.types.js";
import type { UUID } from "../../types/shared.js";
import {
  DataConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/errors.js";
import {
  AUTH_BLACKLIST_SERVICE,
  AUTH_REPOSITORY,
  JWT_REPOSITORY,
  JWT_SERVICE,
  type AuthBlacklistServiceInterface,
  type AuthRepositoryInterface,
  type AuthServiceInterface,
  type JwtRepositoryInterface,
  type JwtServiceInterface,
} from "./auth.di.js";

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepositoryInterface,
    @Inject(JWT_SERVICE)
    private readonly jwtService: JwtServiceInterface,
    @Inject(JWT_REPOSITORY)
    private readonly jwtRepository: JwtRepositoryInterface,
    @Inject(AUTH_BLACKLIST_SERVICE)
    private readonly blacklistService: AuthBlacklistServiceInterface,
  ) {}

  private async issueTokens(userID: UUID, userAgent?: string): Promise<Tokens> {
    const accessToken = this.jwtService.createAccessToken(userID);
    const { token: refreshToken, jti } =
      this.jwtService.createRefreshToken(userID);

    const refreshPayload = this.jwtService.verifyRefreshToken(refreshToken);

    await this.jwtRepository.createRefreshTokenRecord({
      userId: userID,
      jti,
      expiresAt: new Date(refreshPayload.exp * 1000),
      userAgent,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string): Promise<Tokens> {
    const payload = this.jwtService.verifyRefreshToken(refreshToken);
    const blacklisted = await this.blacklistService.isRefreshBlacklisted(
      payload.jti,
    );
    if (blacklisted) {
      throw new UnauthorizedError("Refresh token revoked");
    }

    const refreshTokenData = await this.jwtRepository.findRefreshTokenByJti(
      payload.jti,
    );
    if (!refreshTokenData) {
      throw new UnauthorizedError("Refresh token session not found");
    }

    if (refreshTokenData.revoked_at) {
      throw new UnauthorizedError("Refresh token revoked");
    }

    await this.blacklistService.blacklistRefreshToken(payload.jti, payload.exp);
    await this.jwtRepository.revokeRefreshToken(payload.jti);

    return this.issueTokens(
      payload.sub,
      refreshTokenData.user_agent ?? undefined,
    );
  }

  private async getCurrentUserHash(username: string): Promise<number> {
    const maxHash = await this.authRepository.findMaxUserHash(username);
    return maxHash + 1;
  }

  async registerUser(
    { email, username, password }: UserRegisterData,
    userAgent?: string,
  ): Promise<Tokens> {
    const existingUser = await this.authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new DataConflictError("User with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, config.auth.bcryptRounds);
    const userHash = await this.getCurrentUserHash(username);
    const user = await this.authRepository.createUser(
      username,
      email,
      passwordHash,
      userHash,
    );

    if (!user) {
      throw new InternalServerError("Can't create user");
    }
    return this.issueTokens(user.id, userAgent);
  }

  async loginUser(
    { email, password }: UserLoginData,
    userAgent?: string,
  ): Promise<Tokens> {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new NotFoundError("Invalid email");
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      throw new NotFoundError("Invalid password for this email");
    }

    return this.issueTokens(user.id, userAgent);
  }

  async logoutUser(refreshToken: string): Promise<void> {
    const payload = this.jwtService.verifyRefreshToken(refreshToken);
    const refreshTokenData = await this.jwtRepository.findRefreshTokenByJti(
      payload.jti,
    );
    if (!refreshTokenData) {
      throw new UnauthorizedError("Refresh token session not found");
    }
    if (refreshTokenData.revoked_at) {
      return;
    }
    await this.jwtRepository.revokeRefreshToken(payload.jti);
    await this.blacklistService.blacklistRefreshToken(payload.jti, payload.exp);
  }

  async revokeAllUserRefresh(refreshToken: string): Promise<void> {
    const payload = this.jwtService.verifyRefreshToken(refreshToken);
    const refreshTokenData = await this.jwtRepository.findRefreshTokenByJti(
      payload.jti,
    );
    if (!refreshTokenData) {
      throw new NotFoundError("Refresh token session not found");
    }

    const allUserActiveRefresh =
      await this.jwtRepository.revokeAllUserRefreshTokens(
        refreshTokenData.user_id,
      );
    for (const userRefresh of allUserActiveRefresh) {
      this.blacklistService.blacklistRefreshToken(
        userRefresh.jti,
        userRefresh.expires_at,
      );
    }
  }

  async getUserData(userID: UUID): Promise<UserData> {
    const userData = await this.authRepository.findUserByID(userID);
    if (!userData) {
      throw new NotFoundError("Refresh token session not found");
    }
    return userData;
  }
}
