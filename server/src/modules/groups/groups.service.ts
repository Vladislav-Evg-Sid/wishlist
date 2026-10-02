import { checkGroupUserAccess } from "../../shared/checkUserGroup.js";
import type { UUID } from "../../types/shared.js";
import {
  findGroupsByUserId,
  createGroup,
  findGroupInfo,
  findGroupCreator,
  findGroupMembers,
} from "./groups.repository.js";
import type {
  CreateGroup,
  GroupData,
  GroupInfo,
  GroupUsersList,
} from "./groups.types.js";

export async function getGroupsByUserId(userID: UUID): Promise<GroupData[]> {
  return findGroupsByUserId(userID);
}

export async function addGroup(
  userID: UUID,
  groupData: CreateGroup,
): Promise<void> {
  const groupName = groupData.groupName;
  await createGroup(userID, groupName);
}

export async function getGroupInfo(
  userID: UUID,
  groupID: UUID,
): Promise<GroupInfo> {
  const userAccess = await checkGroupUserAccess(userID, groupID);
  if (!userAccess) {
    throw new Error("User not a member or creator");
  }
  const { title, creatorID } = await findGroupInfo(groupID);

  return {
    title,
    isCreator: creatorID === userID,
  };
}

export async function getGroupUsers(
  userID: UUID,
  groupID: UUID,
): Promise<GroupUsersList> {
  const userAccess = await checkGroupUserAccess(userID, groupID);
  if (!userAccess) {
    throw new Error("User not a member or creator");
  }
  const creator = await findGroupCreator(groupID);
  if (!creator) {
    throw new Error("Group's creator not found");
  }
  const members = await findGroupMembers(groupID);
  const filteredMembers = members.filter(
    ({ name, hash }) => name !== null && hash != null,
  );

  return {
    creator,
    members: filteredMembers,
  };
}
