import type { Request } from "express";

import type { NoParams } from "../../types/requests.js";
import type { UserData } from "./auth.types.js";

export type CreateUserRequestDTO = Request<NoParams, NoParams, UserData>;

export interface UserRaw {
  id: string;
  username: String;
  user_hash: Number;
  email: String;
  password_hash: String;
  created_at: Date;
  updated_at: Date | null;
}

export type RefreshTokenRaw = {
  id: string;
  user_id: string;
  jti: string;
  created_at: Date;
  expires_at: Date;
  revoked_at: Date | null;
  user_agent: string | null;
};
