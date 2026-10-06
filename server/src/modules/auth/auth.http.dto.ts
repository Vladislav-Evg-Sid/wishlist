import type { Request, Response } from "express";
import type z from "zod";

import type { NoParams } from "../../types/requests.js";
import type { UserData } from "./auth.types.js";
import type {
  createUserBodySchema,
  loginUserBodySchema,
} from "./auth.schemas.js";

// CreateUser
interface CreateUserLocals {
  validateBody: z.output<typeof createUserBodySchema>;
}

export type CreateUserRequestDTO = Request<
  NoParams,
  string,
  z.input<typeof createUserBodySchema>
>;
export type CreateUserResponseDTO = Response<string, CreateUserLocals>;

// LoginUser
interface LoginUserLocals {
  validateBody: z.output<typeof loginUserBodySchema>;
}

export type LoginUserRequestDTO = Request<
  NoParams,
  string,
  z.input<typeof loginUserBodySchema>
>;
export type LoginUserResponseDTO = Response<string, LoginUserLocals>;

// GetUserData
export type GetUserDataRequestDTO = Request<NoParams, UserData>;
export type GetUserDataResponseDTO = Response<UserData>;
