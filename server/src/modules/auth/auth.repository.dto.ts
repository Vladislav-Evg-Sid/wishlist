import type { UUID } from "../../types/shared.js";

export interface UserRaw {
  id: UUID;
  username: string;
  user_hash: number;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date | null;
}

export type RefreshTokenRaw = {
  id: UUID;
  user_id: UUID;
  jti: string;
  created_at: Date;
  expires_at: Date;
  revoked_at: Date | null;
  user_agent: string | null;
};
