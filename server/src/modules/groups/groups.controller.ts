import type {
  CreateGroupRequestDTO,
  CreateGroupResponseDTO,
  GetUserGroupsRequestDTO,
  GetUserGroupsResponseDTO,
} from "./groups.dto.js";
import { getGroupsByUserId, setGroup } from "./groups.service.js";

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

export async function createGroupRequest(
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
    await setGroup(userID, { groupName: groupData.group_name });
    res.status(201).send("Successfully created");
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
    res.status(500).send("Unknown internal Server error");
  }
}
