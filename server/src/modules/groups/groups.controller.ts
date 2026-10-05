import type {
  CreateGroupRequestDTO,
  CreateGroupResponseDTO,
  GetGroupInfoRequestDTO,
  GetGroupInfoResponseDTO,
  GetGroupUsersRequestDTO,
  getGroupUsersResponseDTO,
  GetUserGroupsRequestDTO,
  GetUserGroupsResponseDTO,
} from "./groups.dto.js";
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
    res.status(401).send();
    return;
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
    res.status(401).send();
    return;
  }
  const groupData = req.body;

  await addGroup(userID, { groupName: groupData.group_name });
  res.status(201).send("Successfully created");
}

export async function getGroupInfoRequest(
  req: GetGroupInfoRequestDTO,
  res: GetGroupInfoResponseDTO,
): Promise<void> {
  const userID = req.userId;
  if (!userID) {
    res.status(401).send();
    return;
  }
  const groupID = req.params.groupID;

  const { title, isCreator } = await getGroupInfo(userID, groupID);

  res.status(200).json({ title, is_creator: isCreator });
}

export async function getGroupUsersRequest(
  req: GetGroupUsersRequestDTO,
  res: getGroupUsersResponseDTO,
): Promise<void> {
  const userID = req.userId;
  if (!userID) {
    res.status(401).send();
    return;
  }
  const groupID = req.params.groupID;

  const users = await getGroupUsers(userID, groupID);

  res.status(200).json(users);
}
