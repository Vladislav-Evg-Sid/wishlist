import type { Request, Response } from "express";

import type { GroupData } from "./groups.types.js";
import type { NoParams } from "../../types/requests.js";

// HTTP
type UserGroupsRes = GroupData[] | string;

export type GetUserGroupsRequestDTO = Request<NoParams, UserGroupsRes>;
export type GetUserGroupsResponseDTO = Response<UserGroupsRes>;

interface CreateGroupBody {
  group_name: string;
}

export type CreateGroupRequestDTO = Request<NoParams, string, CreateGroupBody>;
export type CreateGroupResponseDTO = Response<string>;

interface GetGroupInfoParams {
  groupID: string;
}

type GetGroupInfoRes = string | { title: string; is_creator: boolean };

export type GetGroupInfoRequestDTO = Request<
  GetGroupInfoParams,
  GetGroupInfoRes
>;
export type GetGroupInfoResponseDTO = Response<GetGroupInfoRes>;

// DB
export interface GroupInfoRaw {
  title: string;
  creatorId: string;
}
