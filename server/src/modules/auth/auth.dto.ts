import type { Request } from "express";

import type { NoParams } from "../../types/requests.js";
import type { UserData } from "./auth.types.js";

export type CreateUserRequestDTO = Request<NoParams, NoParams, UserData>;
