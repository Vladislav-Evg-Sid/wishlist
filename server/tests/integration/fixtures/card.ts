import { db } from "../../../src/db/knex.js";
import {
  TABLES,
  CARD_COLUMNS,
  WISHILST_COLUMNS,
} from "../../../src/db/schema.js";
import type { UUID } from "../../../src/types/shared.js";
import { createWishlist } from "./wishlists.js";
import {
  InternalServerError,
  NotFoundError,
} from "./../../../src/shared/errors.js";

interface InsertedCard {
  id: number;
  [CARD_COLUMNS.title]: string;
  [CARD_COLUMNS.description]: string;
  [CARD_COLUMNS.icon]: string;
  [CARD_COLUMNS.href]: string;
  [CARD_COLUMNS.wishlist_id]: string;
  [CARD_COLUMNS.creator_id]: string;
}

export async function createCardWithParantWishlistID(
  parantWishlistID: UUID,
  creatorID?: UUID,
  cardCount: number = 1,
): Promise<InsertedCard[]> {
  if (!creatorID) {
    const wishlist = await db(TABLES.wishlist)
      .select(WISHILST_COLUMNS.creator_id)
      .where(WISHILST_COLUMNS.id, parantWishlistID)
      .first();
    creatorID = wishlist?.[WISHILST_COLUMNS.creator_id];
  }

  if (!creatorID) {
    throw new NotFoundError("This wishlist not exist");
  }

  const cards = [];
  for (let i = 1; i <= cardCount; i++) {
    cards.push({
      [CARD_COLUMNS.title]: `some gift ${i}`,
      [CARD_COLUMNS.description]: "some interesting gift",
      [CARD_COLUMNS.icon]: "some icon code",
      [CARD_COLUMNS.href]: "",
      [CARD_COLUMNS.wishlist_id]: parantWishlistID,
      [CARD_COLUMNS.creator_id]: creatorID,
    });
  }
  const cardIDs: { id: number }[] = await db(TABLES.card)
    .insert(cards)
    .returning(CARD_COLUMNS.id);

  return cards.map((card, i) => {
    const insertedCard = cardIDs[i];
    if (!insertedCard) {
      throw new InternalServerError("Failed to create card fixture");
    }
    return { ...card, id: insertedCard.id };
  });
}

export async function createCards(
  cardCount: number = 1,
): Promise<{ cards: InsertedCard[]; wishlistID: UUID; creatorID: UUID }> {
  const { creatorID, wishlistID } = await createWishlist();
  const cards = await createCardWithParantWishlistID(
    wishlistID,
    creatorID,
    cardCount,
  );
  return {
    cards,
    wishlistID,
    creatorID,
  };
}
