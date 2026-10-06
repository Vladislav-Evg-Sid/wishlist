import { UnauthorizedError } from "../../shared/errors.js";
import type {
  CreateGroupRequestDTO,
  CreateGroupResponseDTO,
  GetGroupInfoRequestDTO,
  GetGroupInfoResponseDTO,
  GetGroupUsersRequestDTO,
  getGroupUsersResponseDTO,
  GetUserGroupsRequestDTO,
  GetUserGroupsResponseDTO,
} from "./groups.http.dto.js";
import {
  getGroupsByUserId,
  addGroup,
  getGroupInfo,
  getGroupUsers,
} from "./groups.service.js";

export async function getUserGroupsRequest(
  req: GetUserGroupsRequestDTO,
  res: GetUserGroupsResponseDTO,
): Promise<void> {
  const userID = req.userId;
  if (!userID) {
    throw new UnauthorizedError("");
  }
  const groups = await getGroupsByUserId(userID);
  res.status(200).json(groups);
}

export async function addGroupRequest(
  req: CreateGroupRequestDTO,
  res: CreateGroupResponseDTO,
): Promise<void> {
  const userID = req.userId;
  if (!userID) {
    throw new UnauthorizedError("");
  }
  const groupData = res.locals.validateBody;

  await addGroup(userID, groupData);
  res.status(201).send("Successfully created");
}

export async function getGroupInfoRequest(
  req: GetGroupInfoRequestDTO,
  res: GetGroupInfoResponseDTO,
): Promise<void> {
  const userID = req.userId;
  if (!userID) {
    throw new UnauthorizedError("");
  }
  const groupParams = res.locals.validateParams;

  const { title, isCreator } = await getGroupInfo(userID, groupParams.groupID);

  res.status(200).json({ title, is_creator: isCreator });
}

export async function getGroupUsersRequest(
  req: GetGroupUsersRequestDTO,
  res: getGroupUsersResponseDTO,
): Promise<void> {
  const userID = req.userId;
  if (!userID) {
    throw new UnauthorizedError("");
  }
  const groupParams = res.locals.validateParams;

  const users = await getGroupUsers(userID, groupParams.groupID);

  res.status(200).json(users);
}
