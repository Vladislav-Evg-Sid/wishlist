import { checkGroupUserAccess } from "../../shared/checkUserGroup.js";
import {
  createCard,
  findGroupIDByWishlistID,
  findWishlistCards,
} from "./orders.repository.js";
import type { CardData, CardDataInsert } from "./orders.types.js";

export async function getWishlistCards(
  userID: string,
  wishlistID: string,
): Promise<CardData[]> {
  const groupID = await findGroupIDByWishlistID(wishlistID);
  if (!groupID) {
    throw new Error("Not found wishlist's group");
  }

  const userAccess = await checkGroupUserAccess(userID, groupID);
  if (!userAccess) {
    throw new Error("User not a member or creator");
  }

  const cardsRaw = await findWishlistCards(wishlistID);
  console.log(cardsRaw[0]?.description);

  return cardsRaw.map(
    (card): CardData => ({
      id: card.id,
      title: card.title,
      icon: card.icon,
      description: card.description,
      createdAt: card.created_at,
      status: card.status,
      author: {
        id: card.author_id,
        name: card.author_name,
        hash: card.author_hash,
        email: card.author_email,
      },
      reservedBy: card.reserved_by,
      href: card.href ?? "",
    }),
  );
}

export async function addCard(card: CardDataInsert): Promise<void> {
  const groupID = await findGroupIDByWishlistID(card.wishlistID);
  if (!groupID) {
    throw new Error("Not found wishlist's group");
  }

  const userAccess = await checkGroupUserAccess(card.creatorID, groupID);
  if (!userAccess) {
    throw new Error("User not a member or creator");
  }

  await createCard(card);
}
