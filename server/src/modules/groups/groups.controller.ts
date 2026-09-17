import type {
  CreateGroupRequestDTO,
  CreateGroupResponseDTO,
  GetGroupInfoRequestDTO,
  GetGroupInfoResponseDTO,
  GetUserGroupsRequestDTO,
  GetUserGroupsResponseDTO,
} from "./groups.dto.js";
import { getGroupsByUserId, addGroup, getGroupInfo } from "./groups.service.js";

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
