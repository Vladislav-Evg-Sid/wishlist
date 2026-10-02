import { db } from "../../../src/db/knex";
import { TABLES, GROUPS_COLUMNS } from "../../../src/db/schema";
import { createUser } from "./users";

export async function createGroupWithCreatorID(
  creatorID: string,
): Promise<string> {
  const groupIDs = await db(TABLES.groups)
    .insert({
      [GROUPS_COLUMNS.title]: "Vlad's group",
      [GROUPS_COLUMNS.creator_id]: creatorID,
    })
    .returning(GROUPS_COLUMNS.id);
  return groupIDs[0][GROUPS_COLUMNS.id];
}

export async function createGroup(): Promise<{
  creatorID: string;
  groupID: string;
}> {
  const creatorID = await createUser();
  const groupID = await createGroupWithCreatorID(creatorID);
  return {
    creatorID,
    groupID,
  };
}
