import { Injectable } from "@nestjs/common";

import { db } from "../../db/knex.js";
import { TABLES, WISHILST_COLUMNS } from "../../db/schema.js";
import type { UUID } from "../../types/shared.js";
import type { CreateWishlistData, WishlistData } from "./wishlists.types.js";
import type { WishlistsRepositoryInterface } from "./wishlists.di.js";
import type { WishlistInfoRaw } from "./wishlists.repository.dto.js";

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

  async findWishlistInfo(wishlistID: UUID): Promise<WishlistInfoRaw> {
    return db(TABLES.wishlist)
      .select({
        title: WISHILST_COLUMNS.title,
        creatorID: WISHILST_COLUMNS.creator_id,
      })
      .where(WISHILST_COLUMNS.id, wishlistID)
      .first();
  }

  async deleteWishlist(wishlistID: UUID): Promise<void> {
    await db(TABLES.wishlist).delete().where(WISHILST_COLUMNS.id, wishlistID);
  }

  async updateWishlistName(wishlistID: UUID, newName: string): Promise<void> {
    await db(TABLES.wishlist)
      .update({ [WISHILST_COLUMNS.title]: newName })
      .where(WISHILST_COLUMNS.id, wishlistID);
  }

  async findGroupIDByWishlistID(wishlistID: UUID): Promise<UUID | null> {
    const groupID = await db(TABLES.wishlist)
      .select(WISHILST_COLUMNS.group_id)
      .where(WISHILST_COLUMNS.id, wishlistID)
      .first();
    return groupID?.group_id ?? null;
  }
}
