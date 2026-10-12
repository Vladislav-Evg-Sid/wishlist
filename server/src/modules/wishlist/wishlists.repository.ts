import { Injectable } from "@nestjs/common";

import { db } from "../../db/knex.js";
import { TABLES, WISHILST_COLUMNS } from "../../db/schema.js";
import type { UUID } from "../../types/shared.js";
import type { CreateWishlistData, WishlistData } from "./wishlists.types.js";
import type { WishlistsRepositoryInterface } from "./wishlists.di.js";

@Injectable()
export class WishlistsRepository implements WishlistsRepositoryInterface {
  async findGroupWishlists(groupID: UUID): Promise<WishlistData[]> {
    return db(TABLES.wishlist)
      .select({
        id: WISHILST_COLUMNS.id,
        title: WISHILST_COLUMNS.title,
      })
      .where({ [WISHILST_COLUMNS.group_id]: groupID });
  }

  async createWishlist(wishlist: CreateWishlistData): Promise<string> {
    const wishlistID = await db(TABLES.wishlist)
      .insert({
        [WISHILST_COLUMNS.creator_id]: wishlist.creatorID,
        [WISHILST_COLUMNS.group_id]: wishlist.groupID,
        [WISHILST_COLUMNS.title]: wishlist.name,
      })
      .returning(WISHILST_COLUMNS.id);
    return String(wishlistID[0]);
  }
}
