import type { UUID } from "../../types/shared.js";
import type { GroupInfoRaw } from "./groups.repository.dto.js";
import type {
  CreateGroup,
  GroupData,
  GroupInfo,
  GroupUsersList,
  UserData,
} from "./groups.types.js";

export const GROUPS_REPOSITORY = Symbol("GROUPS_REPOSITORY");

export interface GroupsRepositoryInterface {
  findGroupsByUserId(userID: UUID): Promise<GroupData[]>;
  createGroup(userID: UUID, groupName: string): Promise<string>;
  findGroupInfo(groupID: UUID): Promise<GroupInfoRaw>;
  findGroupCreator(groupID: UUID): Promise<UserData | undefined>;
  findGroupMembers(groupID: UUID): Promise<UserData[]>;
  updateGroupName(groupID: UUID, newName: string): Promise<void>;
  deleteGroup(groupID: UUID): Promise<void>;
  addGroupMember(groupID: UUID, memberID: UUID): Promise<void>;
}

export const GROUPS_SERVICE = Symbol("GROUPS_SERVICE");

export interface GroupsServiceInterface {
  getGroupsByUserId(userID: UUID): Promise<GroupData[]>;
  addGroup(userID: UUID, groupData: CreateGroup): Promise<void>;
  getGroupInfo(userID: UUID, groupID: UUID): Promise<GroupInfo>;
  getGroupUsers(userID: UUID, groupID: UUID): Promise<GroupUsersList>;
  updateGroupName(userID: UUID, groupID: UUID, newName: string): Promise<void>;
  deleteGroup(userID: UUID, groupID: UUID): Promise<void>;
  createInviteCode(
    userID: UUID,
    groupID: UUID,
    ttl: number | null,
    limitMembers: number | null,
  ): Promise<string>;
  addMemberByInviteCode(userID: UUID, code: string): Promise<UUID>;
}
