import type { Request, Response } from "express";

import type { NoParams } from "../../types/requests.js";
import type {
  UserRegisterData,
  UserLoginData,
  UserData,
} from "./auth.types.js";

// HTTP
type AccessTokenRes =
  | {
      accessToken: string;
    }
  | string;

type UserDataRes = UserData | string;

export type CreateUserRequestDTO = Request<
  NoParams,
  AccessTokenRes,
  UserRegisterData
>;
export type CreateUserResponseDTO = Response<AccessTokenRes>;

export type LoginUserRequestDTO = Request<
  NoParams,
  AccessTokenRes,
  UserLoginData
>;
export type LoginUserResponseDTO = Response<AccessTokenRes>;

export type GetUserDataRequestDTO = Request<NoParams, UserDataRes>;
export type GetUserDataResponseDTO = Response<UserDataRes>;

// DB
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
