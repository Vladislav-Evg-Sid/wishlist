import { db } from "../../db/knex.js";
import { GROUPS_COLUMNS, TABLES } from "../../db/schema.js";
import type { GroupData } from "./groups.types.js";

export async function getGroupsByUserId(userID: string): Promise<GroupData[]> {
  return await db(TABLES.groups)
    .select(GROUPS_COLUMNS.id, GROUPS_COLUMNS.title)
    .where(GROUPS_COLUMNS.creator_id, userID);
}
