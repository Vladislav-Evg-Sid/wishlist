import { db } from "../../db/knex.js";
import { TABLES, WISHILST_COLUMNS } from "../../db/schema.js";
import type { CreateWishlistData, WishlistData } from "./wishlists.types.js";

export async function findGroupWishlists(
  groupID: string,
): Promise<WishlistData[]> {
  return db(TABLES.wishlist)
    .select({
      id: WISHILST_COLUMNS.id,
      title: WISHILST_COLUMNS.title,
    })
    .where({ [WISHILST_COLUMNS.group_id]: groupID });
}

export async function createWishlist(
  wishlist: CreateWishlistData,
): Promise<string> {
  const wishlistID = await db(TABLES.wishlist)
    .insert({
      [WISHILST_COLUMNS.creator_id]: wishlist.creatorID,
      [WISHILST_COLUMNS.group_id]: wishlist.groupID,
      [WISHILST_COLUMNS.title]: wishlist.name,
    })
    .returning(WISHILST_COLUMNS.id);
  return String(wishlistID[0]);
}
