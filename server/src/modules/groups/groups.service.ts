import { checkGroupUserAccess } from "../../shared/checkUserGroup.js";
import {
  findGroupsByUserId,
  createGroup,
  findGroupInfo,
} from "./groups.repository.js";
import type { CreateGroup, GroupData, GroupInfo } from "./groups.types.js";

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

export async function getGroupInfo(
  userID: string,
  groupID: string,
): Promise<GroupInfo> {
  const userAccess = await checkGroupUserAccess(userID, groupID);
  if (!userAccess) {
    throw new Error("User not a member or creator");
  }
  const { title, creatorId } = await findGroupInfo(groupID);

  return {
    title,
    isCreator: creatorId === userID,
  };
}
