import type { JwtPayload } from "jsonwebtoken";

import type { UUID } from "../../types/shared.js";

export type AccessTokenPayload = JwtPayload & {
  sub: UUID; // JWT clain subject
  type: "access";
};

export type RefreshTokenPayload = JwtPayload & {
  sub: UUID; // JWT clain subject
  jti: string; // ID refresh-токенаexp
  exp: number; // Время, после которого токен устаревает
  type: "refresh";
};

export interface User {
  id: UUID;
  email: string;
  username: string;
  userHash: string;
  passwordHash: string;
}

export interface UserData {
  id: UUID;
  email: string;
  username: string;
  userHash: string;
}

export interface UserRegisterData {
  email: string;
  username: string;
  password: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
