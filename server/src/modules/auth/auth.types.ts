import type { JwtPayload } from "jsonwebtoken";

export type AccessTokenPayload = JwtPayload & {
  sub: string; // JWT clain subject
  type: "access";
};

export type RefreshTokenPayload = JwtPayload & {
  sub: string; // JWT clain subject
  jti: string; // ID refresh-токенаexp
  exp: number; // Время, после которого токен устаревает
  type: "refresh";
};

export interface User {
  id: string;
  email: string;
  username: string;
  userHash: string;
  passwordHash: string;
}

export interface UserData {
  email: string;
  username: string;
  password: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}
