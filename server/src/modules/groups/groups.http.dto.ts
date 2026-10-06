import type { Request, Response } from "express";
import type z from "zod";

import type { GroupData, GroupUsersList } from "./groups.types.js";
import type { NoParams } from "../../types/requests.js";
import {
  createGroupBodySchema,
  getGroupInfoParamsSchema,
} from "./groups.schemas.js";

// GetUserGroups
export type GetUserGroupsRequestDTO = Request<NoParams, GroupData[]>;
export type GetUserGroupsResponseDTO = Response<GroupData[]>;

// CreateGroup
interface CreateGroupLocals {
  validateBody: z.output<typeof createGroupBodySchema>;
}

export type CreateGroupRequestDTO = Request<
  NoParams,
  string,
  z.input<typeof createGroupBodySchema>
>;
export type CreateGroupResponseDTO = Response<string, CreateGroupLocals>;

// GetGroupInfo
interface GetGroupLocals {
  validateParams: z.output<typeof getGroupInfoParamsSchema>;
}

interface GetGroupInfoRes {
  title: string;
  is_creator: boolean;
}

export type GetGroupInfoRequestDTO = Request<
  z.input<typeof getGroupInfoParamsSchema>,
  GetGroupInfoRes
>;
export type GetGroupInfoResponseDTO = Response<GetGroupInfoRes, GetGroupLocals>;

// GetGroupUser
export type GetGroupUsersRequestDTO = Request<
  z.input<typeof getGroupInfoParamsSchema>,
  GroupUsersList
>;
export type getGroupUsersResponseDTO = Response<GroupUsersList, GetGroupLocals>;
