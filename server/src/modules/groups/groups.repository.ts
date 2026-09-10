import { db } from "../../db/knex.js";
import { GROUPS_COLUMNS, TABLES } from "../../db/schema.js";
import type { GroupData } from "./groups.types.js";

export async function findGroupsByUserId(userID: string): Promise<GroupData[]> {
  return await db(TABLES.groups)
    .select(GROUPS_COLUMNS.id, GROUPS_COLUMNS.title)
    .where(GROUPS_COLUMNS.creator_id, userID);
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
