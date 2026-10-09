import type { UUID } from "../../types/shared.js";

type JtiType = `${string}-${string}-${string}-${string}-${string}`;

export interface CreateRefreshTokenData {
  userId: UUID;
  jti: string;
  expiresAt: Date;
  userAgent: string | undefined;
}

export interface RevokeRefreshTokenData {
  jti: JtiType;
  expires_at: number;
}

export interface TokenData {
  token: string;
  jti: JtiType;
}
