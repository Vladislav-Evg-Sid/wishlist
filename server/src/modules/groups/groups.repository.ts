import { db } from "../../db/knex.js";
import {
  GROUP_MEMBER_COLUMNS,
  GROUPS_COLUMNS,
  TABLES,
  USER_COLUMNS,
} from "../../db/schema.js";
import { concatTableAndColumn } from "../../shared/dbUtils.js";
import type { GroupInfoRaw } from "./groups.dto.js";
import type { GroupData, GroupUser } from "./groups.types.js";

export async function findGroupsByUserId(userID: string): Promise<GroupData[]> {
  return await db(TABLES.groups)
    .leftJoin(
      TABLES.group_member,
      concatTableAndColumn(TABLES.groups, GROUPS_COLUMNS.id),
      concatTableAndColumn(TABLES.group_member, GROUP_MEMBER_COLUMNS.group_id),
    )
    .select(GROUPS_COLUMNS.id, GROUPS_COLUMNS.title)
    .where(GROUPS_COLUMNS.creator_id, userID)
    .orWhere(GROUP_MEMBER_COLUMNS.member_id, userID);
}

export async function createGroup(
  userID: string,
  groupName: string,
): Promise<string> {
  const groupID = await db(TABLES.groups)
    .insert({
      [GROUPS_COLUMNS.creator_id]: userID,
      [GROUPS_COLUMNS.title]: groupName,
    })
    .returning(GROUPS_COLUMNS.id);
  return String(groupID[0]);
}

export async function findGroupInfo(groupID: string): Promise<GroupInfoRaw> {
  return db(TABLES.groups)
    .select({
      title: GROUPS_COLUMNS.title,
      creatorID: GROUPS_COLUMNS.creator_id,
    })
    .where(GROUPS_COLUMNS.id, groupID)
    .first();
}

export async function findGroupCreator(
  groupID: string,
): Promise<GroupUser | undefined> {
  return db(TABLES.groups)
    .leftJoin(
      TABLES.users,
      concatTableAndColumn(TABLES.groups, GROUPS_COLUMNS.creator_id),
      concatTableAndColumn(TABLES.users, USER_COLUMNS.id),
    )
    .select({
      name: USER_COLUMNS.username,
      hash: USER_COLUMNS.user_hash,
    })
    .where(concatTableAndColumn(TABLES.groups, GROUPS_COLUMNS.id), groupID)
    .first();
}

export async function findGroupMembers(groupID: string): Promise<GroupUser[]> {
  return db(TABLES.groups)
    .leftJoin(
      TABLES.group_member,
      concatTableAndColumn(TABLES.groups, GROUPS_COLUMNS.id),
      concatTableAndColumn(TABLES.group_member, GROUP_MEMBER_COLUMNS.group_id),
    )
    .leftJoin(
      TABLES.users,
      concatTableAndColumn(TABLES.group_member, GROUP_MEMBER_COLUMNS.member_id),
      concatTableAndColumn(TABLES.users, USER_COLUMNS.id),
    )
    .select({
      name: USER_COLUMNS.username,
      hash: USER_COLUMNS.user_hash,
    })
    .where(concatTableAndColumn(TABLES.groups, GROUPS_COLUMNS.id), groupID);
}
