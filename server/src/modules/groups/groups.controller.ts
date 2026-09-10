import type {
  GetUserGroupsRequstDTO,
  GetUserGroupsResponseDTO,
} from "./groups.dto.js";
import { getGroupsByUserId } from "./groups.service.js";

export async function getUserGroups(
  req: GetUserGroupsRequstDTO,
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
