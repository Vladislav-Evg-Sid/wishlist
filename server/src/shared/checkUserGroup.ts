import { db } from "../db/knex.js";
import { GROUP_MEMBER_COLUMNS, GROUPS_COLUMNS, TABLES } from "../db/schema.js";
import { concatTableAndColumn } from "./dbUtils.js";

export async function checkGroupUserAccess(
  userID: string,
  groupID: string,
): Promise<boolean> {
  const group = await db(TABLES.groups)
    .leftJoin(
      TABLES.group_member,
      concatTableAndColumn(TABLES.groups, GROUPS_COLUMNS.id),
      concatTableAndColumn(TABLES.group_member, GROUP_MEMBER_COLUMNS.group_id),
    )
    .where(concatTableAndColumn(TABLES.groups, GROUPS_COLUMNS.id), groupID)
    .andWhere(function () {
      this.where(
        concatTableAndColumn(TABLES.groups, GROUPS_COLUMNS.creator_id),
        userID,
      ).orWhere(
        concatTableAndColumn(
          TABLES.group_member,
          GROUP_MEMBER_COLUMNS.member_id,
        ),
        userID,
      );
    })
    .first();

  return Boolean(group);
}
