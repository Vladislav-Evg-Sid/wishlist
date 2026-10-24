import type { Knex } from "knex";

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
  findGroupsByUserId(
    userID: UUID,
    connection?: Knex | Knex.Transaction,
  ): Promise<GroupData[]>;
  createGroup(
    userID: UUID,
    groupName: string,
    connection?: Knex | Knex.Transaction,
  ): Promise<string>;
  findGroupInfo(
    groupID: UUID,
    connection?: Knex | Knex.Transaction,
  ): Promise<GroupInfoRaw>;
  findGroupCreator(
    groupID: UUID,
    connection?: Knex | Knex.Transaction,
  ): Promise<UserData | undefined>;
  findGroupMembers(
    groupID: UUID,
    connection?: Knex | Knex.Transaction,
  ): Promise<UserData[]>;
  updateGroupName(
    groupID: UUID,
    newName: string,
    connection?: Knex | Knex.Transaction,
  ): Promise<void>;
  deleteGroup(
    groupID: UUID,
    connection?: Knex | Knex.Transaction,
  ): Promise<void>;
  addGroupMember(
    groupID: UUID,
    memberID: UUID,
    connection?: Knex | Knex.Transaction,
  ): Promise<void>;
  deleteMember(
    groupID: UUID,
    memberID: UUID,
    connection?: Knex | Knex.Transaction,
  ): Promise<void>;
  changeCreator(
    groupID: UUID,
    newCreatorID: UUID,
    connection?: Knex | Knex.Transaction,
  ): Promise<void>;
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
  deleteMember(userID: UUID, groupID: UUID, memberID: UUID): Promise<void>;
  changeCreator(userID: UUID, groupID: UUID, newCreatorID: UUID): Promise<void>;
}
