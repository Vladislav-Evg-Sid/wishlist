import { db } from "../../../src/db/knex";
import {
  GROUPS_COLUMNS,
  TABLES,
  WISHILST_COLUMNS,
} from "../../../src/db/schema";
import { NotFoundError } from "../../../src/shared/errors";
import { UUID } from "../../../src/types/shared";
import { createGroup } from "./groups";

export async function createWishlistWithParantGroupID(
  parantGroupID: UUID,
  creatorID?: UUID,
): Promise<UUID> {
  if (!creatorID) {
    let creatorID = db(TABLES.groups)
      .select(GROUPS_COLUMNS.creator_id)
      .where(GROUPS_COLUMNS.id, parantGroupID);

    if (!creatorID) {
      throw new NotFoundError("This group not exist");
    }
  }

  const wishlistIDs = await db(TABLES.wishlist)
    .insert({
      [WISHILST_COLUMNS.title]: "wishlist in Vlad's group",
      [WISHILST_COLUMNS.group_id]: parantGroupID,
      [WISHILST_COLUMNS.creator_id]: creatorID,
    })
    .returning(WISHILST_COLUMNS.id);
  return wishlistIDs[0][WISHILST_COLUMNS.id];
}

export async function createWishlist(): Promise<{
  creatorID: UUID;
  groupID: UUID;
  wishlistID: UUID;
}> {
  const { creatorID, groupID } = await createGroup();
  const wishlistID = await createWishlistWithParantGroupID(groupID, creatorID);
  return {
    creatorID,
    groupID,
    wishlistID,
  };
}
