import { db } from "../../../src/db/knex";
import { TABLES, CARD_COLUMNS, WISHILST_COLUMNS } from "../../../src/db/schema";
import { createWishlist } from "./wishlists";

interface InsertedCard {
  id: string;
  [CARD_COLUMNS.title]: string;
  [CARD_COLUMNS.description]: string;
  [CARD_COLUMNS.icon]: string;
  [CARD_COLUMNS.href]: string;
  [CARD_COLUMNS.wishlist_id]: string;
  [CARD_COLUMNS.creator_id]: string;
}

export async function createCardWithParantWishlistID(
  parantWishlistID: string,
  creatorID?: string,
  cardCount: number = 1,
): Promise<InsertedCard[]> {
  if (!creatorID) {
    creatorID = await db(TABLES.wishlist)
      .select(WISHILST_COLUMNS.creator_id)
      .where(WISHILST_COLUMNS.id, parantWishlistID)
      .first();
  }

  if (!creatorID) {
    throw new Error("This wishlist not exist");
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
  const cardIDs: { id: string }[] = await db(TABLES.card)
    .insert(cards)
    .returning(CARD_COLUMNS.id);

  return cards.map((card, i) => ({ ...card, id: cardIDs[i]?.id ?? "" }));
}

export async function createCards(
  cardCount: number = 1,
): Promise<{ cards: InsertedCard[]; wishlistID: string; creatorID: string }> {
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
