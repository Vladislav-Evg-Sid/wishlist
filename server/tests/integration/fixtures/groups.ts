import { db } from "../../../src/db/knex.js";
import {
  TABLES,
  GROUPS_COLUMNS,
  GROUP_MEMBER_COLUMNS,
} from "../../../src/db/schema.js";
import type { UUID } from "../../../src/types/shared.js";
import { createUser } from "./users.js";

export async function addGroupMember(
  groupID: UUID,
  memberID: UUID,
): Promise<void> {
  await db(TABLES.group_member).insert({
    [GROUP_MEMBER_COLUMNS.group_id]: groupID,
    [GROUP_MEMBER_COLUMNS.member_id]: memberID,
  });
}

export async function createGroupWithCreatorID(creatorID: UUID): Promise<UUID> {
  const groupIDs = await db(TABLES.groups)
    .insert({
      [GROUPS_COLUMNS.title]: "Vlad's group",
      [GROUPS_COLUMNS.creator_id]: creatorID,
    })
    .returning(GROUPS_COLUMNS.id);
  return groupIDs[0][GROUPS_COLUMNS.id];
}

export async function createGroup(): Promise<{
  creatorID: UUID;
  groupID: UUID;
}> {
  const creatorID = await createUser();
  const groupID = await createGroupWithCreatorID(creatorID);
  return {
    creatorID,
    groupID,
  };
}
