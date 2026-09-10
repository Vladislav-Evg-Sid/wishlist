import type { Request, Response } from "express";

import type { GroupData } from "./groups.types.js";
import type { NoParams } from "../../types/requests.js";

type UserGroupsRes = GroupData[] | string;

export type GetUserGroupsRequstDTO = Request<NoParams, UserGroupsRes>;
export type GetUserGroupsResponseDTO = Response<UserGroupsRes>;
