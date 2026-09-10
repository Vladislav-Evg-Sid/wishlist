import { findGroupsByUserId, createGroup } from "./groups.repository.js";
import type { CreateGroup, GroupData } from "./groups.types.js";

export async function getGroupsByUserId(userID: string): Promise<GroupData[]> {
  return findGroupsByUserId(userID);
}

export async function setGroup(
  userID: string,
  groupData: CreateGroup,
): Promise<void> {
  const groupName = groupData.groupName;
  await createGroup(userID, groupName);
}
