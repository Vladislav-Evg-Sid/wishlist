import type { Request, Response } from "express";

import type { GroupData } from "./groups.types.js";
import type { NoParams } from "../../types/requests.js";

type UserGroupsRes = GroupData[] | string;

export type GetUserGroupsRequestDTO = Request<NoParams, UserGroupsRes>;
export type GetUserGroupsResponseDTO = Response<UserGroupsRes>;

export interface CreateGroupRes {
  group_name: string;
}

export type CreateGroupRequestDTO = Request<NoParams, string, CreateGroupRes>;
export type CreateGroupResponseDTO = Response<string>;
