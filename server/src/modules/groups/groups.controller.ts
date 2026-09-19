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
  try {
    const groups = await getGroupsByUserId(userID);
    res.status(200).json(groups);
  } catch {
    res.status(500).send("Unknown internal Server error");
  }
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
  try {
    await addGroup(userID, { groupName: groupData.group_name });
    res.status(201).send("Successfully created");
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
      return;
    }
    res.status(500).send("Unknown internal Server error");
  }
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

  try {
    const { title, isCreator } = await getGroupInfo(userID, groupID);

    res.status(200).json({ title, is_creator: isCreator });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "User not a member or creator") {
        res.status(403).send(error.message);
        return;
      }
      res.status(500).send(error.message);
      return;
    }
    res.status(500).send("Unknown internal Server error");
  }
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

  try {
    const users = await getGroupUsers(userID, groupID);

    res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "User not a member or creator") {
        res.status(403).send(error.message);
        return;
      }
      if (error.message === "Group's creator not found") {
        res.status(404).send(error.message);
      }
      res.status(500).send(error.message);
      return;
    }
    res.status(500).send("Unknown internal Server error");
  }
}
