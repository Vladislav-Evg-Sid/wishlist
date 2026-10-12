import type { UUID } from "../../types/shared.js";
import type { GroupInfoRaw } from "./groups.repository.dto.js";
import type {
  CreateGroup,
  GroupData,
  GroupInfo,
  GroupUser,
  GroupUsersList,
} from "./groups.types.js";

export const GROUPS_REPOSITORY = Symbol("GROUPS_REPOSITORY");

export interface GroupsRepositoryInterface {
  findGroupsByUserId(userID: UUID): Promise<GroupData[]>;
  createGroup(userID: UUID, groupName: string): Promise<string>;
  findGroupInfo(groupID: UUID): Promise<GroupInfoRaw>;
  findGroupCreator(groupID: UUID): Promise<GroupUser | undefined>;
  findGroupMembers(groupID: UUID): Promise<GroupUser[]>;
}

export const GROUPS_SERVICE = Symbol("GROUPS_SERVICE");

export interface GroupsServiceInterface {
  getGroupsByUserId(userID: UUID): Promise<GroupData[]>;
  addGroup(userID: UUID, groupData: CreateGroup): Promise<void>;
  getGroupInfo(userID: UUID, groupID: UUID): Promise<GroupInfo>;
  getGroupUsers(userID: UUID, groupID: UUID): Promise<GroupUsersList>;
}
