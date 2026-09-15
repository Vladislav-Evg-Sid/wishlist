import { db } from "../../db/knex.js";
import {
  GROUP_MEMBER_COLUMNS,
  GROUPS_COLUMNS,
  TABLES,
  WISHILST_COLUMNS,
} from "../../db/schema.js";
import { concatTableAndColumn } from "../../shared/dbUtils.js";
import type { WishlistData } from "./wishlists.types.js";

export async function checkWishlistUserAccess(
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

export async function findGroupWishlists(
  groupID: string,
): Promise<WishlistData[]> {
  return db(TABLES.wishlist)
    .select({
      id: WISHILST_COLUMNS.id,
      name: WISHILST_COLUMNS.title,
    })
    .where({ [WISHILST_COLUMNS.group_id]: groupID });
}
