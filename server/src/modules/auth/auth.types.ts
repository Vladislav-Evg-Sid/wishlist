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

export type RefreshTokenRecord = {
  id: string;
  user_id: string;
  jti: string;
  created_at: Date;
  expires_at: Date;
  revoked_at: Date | null;
  user_agent: string | null;
};

export interface User {
  id: string;
  email: string;
  username: string;
  userHash: string;
  passwordHash: string;
}
