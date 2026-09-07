import type { Request, Response } from "express";

import type { NoParams } from "../../types/requests.js";
import type { UserData, UserLoginData } from "./auth.types.js";

type AccessTokenRes =
  | {
      accessToken: string;
    }
  | string;

export type CreateUserRequestDTO = Request<NoParams, AccessTokenRes, UserData>;
export type CreateUserResponseDTO = Response<AccessTokenRes>;

export type LoginUserRequestDTO = Request<
  NoParams,
  AccessTokenRes,
  UserLoginData
>;
export type LoginUserResponseDTO = Response<AccessTokenRes>;

export interface UserRaw {
  id: string;
  username: string;
  user_hash: number;
  email: string;
  password_hash: string;
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
