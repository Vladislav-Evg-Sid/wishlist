import { db } from "../../db/knex.js";
import {
  CARD_COLUMNS,
  TABLES,
  USER_COLUMNS,
  WISHILST_COLUMNS,
} from "../../db/schema.js";
import { concatTableAndColumn } from "../../shared/dbUtils.js";
import type { CardDataRaw } from "./orders.dto.js";
import type { CardDataInsert } from "./orders.types.js";

export async function findGroupIDByWishlistID(
  wishlistID: string,
): Promise<string | null> {
  const groupID = await db(TABLES.wishlist)
    .select(WISHILST_COLUMNS.group_id)
    .where(WISHILST_COLUMNS.id, wishlistID)
    .first();
  return groupID.group_id;
}

export async function findWishlistCards(
  wishlistID: string,
): Promise<CardDataRaw[]> {
  return db(TABLES.card)
    .join(
      TABLES.users,
      concatTableAndColumn(TABLES.card, CARD_COLUMNS.creator_id),
      concatTableAndColumn(TABLES.users, USER_COLUMNS.id),
    )
    .select({
      id: concatTableAndColumn(TABLES.card, CARD_COLUMNS.id),
      title: CARD_COLUMNS.title,
      icon: CARD_COLUMNS.icon,
      description: CARD_COLUMNS.description,
      created_at: concatTableAndColumn(TABLES.card, CARD_COLUMNS.created_at),
      status: CARD_COLUMNS.status,
      author_id: concatTableAndColumn(TABLES.users, USER_COLUMNS.id),
      author_name: USER_COLUMNS.username,
      author_email: USER_COLUMNS.email,
      author_hash: USER_COLUMNS.user_hash,
      reserd_by: CARD_COLUMNS.reserved_by,
      href: CARD_COLUMNS.href,
    })
    .where(CARD_COLUMNS.wishlist_id, wishlistID);
}

export async function createCard(card: CardDataInsert): Promise<string> {
  return db(TABLES.card)
    .insert({
      [CARD_COLUMNS.title]: card.title,
      [CARD_COLUMNS.description]: card.description,
      [CARD_COLUMNS.icon]: card.icon,
      [CARD_COLUMNS.href]: card.href,
      [CARD_COLUMNS.wishlist_id]: card.wishlistID,
      [CARD_COLUMNS.creator_id]: card.creatorID,
    })
    .returning(CARD_COLUMNS.id);
}
