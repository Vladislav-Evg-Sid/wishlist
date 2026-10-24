import { Injectable } from "@nestjs/common";
import type { Knex } from "knex";

import { db } from "../../db/knex.js";
import {
  GROUP_MEMBER_COLUMNS,
  GROUPS_COLUMNS,
  TABLES,
  USER_COLUMNS,
} from "../../db/schema.js";
import { concatTableAndColumn } from "../../shared/dbUtils.js";
import type { UUID } from "../../types/shared.js";
import type { GroupInfoRaw } from "./groups.repository.dto.js";
import type { GroupData, UserData } from "./groups.types.js";
import type { GroupsRepositoryInterface } from "./groups.di.js";

@Injectable()
export class GroupsRepository implements GroupsRepositoryInterface {
  async findGroupsByUserId(
    userID: UUID,
    connection: Knex | Knex.Transaction = db,
  ): Promise<GroupData[]> {
    return await connection(TABLES.groups)
      .leftJoin(
        TABLES.group_member,
        concatTableAndColumn(TABLES.groups, GROUPS_COLUMNS.id),
        concatTableAndColumn(
          TABLES.group_member,
          GROUP_MEMBER_COLUMNS.group_id,
        ),
      )
      .select(GROUPS_COLUMNS.id, GROUPS_COLUMNS.title)
      .where(GROUPS_COLUMNS.creator_id, userID)
      .orWhere(GROUP_MEMBER_COLUMNS.member_id, userID)
      .groupBy(concatTableAndColumn(TABLES.groups, GROUPS_COLUMNS.id))
      .orderBy(concatTableAndColumn(TABLES.groups, GROUPS_COLUMNS.title));
  }

  async createGroup(
    userID: UUID,
    groupName: string,
    connection: Knex | Knex.Transaction = db,
  ): Promise<string> {
    const groupID = await connection(TABLES.groups)
      .insert({
        [GROUPS_COLUMNS.creator_id]: userID,
        [GROUPS_COLUMNS.title]: groupName,
      })
      .returning(GROUPS_COLUMNS.id);
    return String(groupID[0]);
  }

  async findGroupInfo(
    groupID: UUID,
    connection: Knex | Knex.Transaction = db,
  ): Promise<GroupInfoRaw> {
    return connection(TABLES.groups)
      .select({
        title: GROUPS_COLUMNS.title,
        creatorID: GROUPS_COLUMNS.creator_id,
      })
      .where(GROUPS_COLUMNS.id, groupID)
      .first();
  }

  async findGroupCreator(
    groupID: UUID,
    connection: Knex | Knex.Transaction = db,
  ): Promise<UserData | undefined> {
    return connection(TABLES.groups)
      .leftJoin(
        TABLES.users,
        concatTableAndColumn(TABLES.groups, GROUPS_COLUMNS.creator_id),
        concatTableAndColumn(TABLES.users, USER_COLUMNS.id),
      )
      .select({
        name: USER_COLUMNS.username,
        hash: USER_COLUMNS.user_hash,
        id: concatTableAndColumn(TABLES.users, USER_COLUMNS.id),
      })
      .where(concatTableAndColumn(TABLES.groups, GROUPS_COLUMNS.id), groupID)
      .first();
  }

  async findGroupMembers(
    groupID: UUID,
    connection: Knex | Knex.Transaction = db,
  ): Promise<UserData[]> {
    return connection(TABLES.groups)
      .leftJoin(
        TABLES.group_member,
        concatTableAndColumn(TABLES.groups, GROUPS_COLUMNS.id),
        concatTableAndColumn(
          TABLES.group_member,
          GROUP_MEMBER_COLUMNS.group_id,
        ),
      )
      .leftJoin(
        TABLES.users,
        concatTableAndColumn(
          TABLES.group_member,
          GROUP_MEMBER_COLUMNS.member_id,
        ),
        concatTableAndColumn(TABLES.users, USER_COLUMNS.id),
      )
      .select({
        name: USER_COLUMNS.username,
        hash: USER_COLUMNS.user_hash,
        id: concatTableAndColumn(TABLES.users, USER_COLUMNS.id),
      })
      .where(concatTableAndColumn(TABLES.groups, GROUPS_COLUMNS.id), groupID);
  }

  async updateGroupName(
    groupID: UUID,
    newName: string,
    connection: Knex | Knex.Transaction = db,
  ): Promise<void> {
    await connection(TABLES.groups)
      .update({
        [GROUPS_COLUMNS.title]: newName,
      })
      .where(GROUPS_COLUMNS.id, groupID);
  }

  async deleteGroup(
    groupID: UUID,
    connection: Knex | Knex.Transaction = db,
  ): Promise<void> {
    await connection(TABLES.groups).delete().where(GROUPS_COLUMNS.id, groupID);
  }

  async addGroupMember(
    groupID: UUID,
    memberID: UUID,
    connection: Knex | Knex.Transaction = db,
  ): Promise<void> {
    await connection(TABLES.group_member).insert({
      [GROUP_MEMBER_COLUMNS.group_id]: groupID,
      [GROUP_MEMBER_COLUMNS.member_id]: memberID,
    });
  }

  async deleteMember(
    groupID: UUID,
    memberID: UUID,
    connection: Knex | Knex.Transaction = db,
  ): Promise<void> {
    await connection(TABLES.group_member)
      .delete()
      .where({
        [GROUP_MEMBER_COLUMNS.group_id]: groupID,
        [GROUP_MEMBER_COLUMNS.member_id]: memberID,
      });
  }

  async changeCreator(
    groupID: UUID,
    newCreatorID: UUID,
    connection: Knex | Knex.Transaction = db,
  ): Promise<void> {
    await connection(TABLES.groups)
      .update({
        [GROUPS_COLUMNS.creator_id]: newCreatorID,
      })
      .where(GROUPS_COLUMNS.id, groupID);
  }
}
