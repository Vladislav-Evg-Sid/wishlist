import type {
  AddCardRequestDTO,
  AddCardResponseDTO,
  GetWishlistCardsRequestDTO,
  GetWishlistCardsResponseDTO,
} from "./orders.dto.js";
import { addCard, getWishlistCards } from "./orders.service.js";

export async function getWishlistCardsRequest(
  req: GetWishlistCardsRequestDTO,
  res: GetWishlistCardsResponseDTO,
): Promise<void> {
  const userID = req.userId;
  if (!userID) {
    res.status(401).send();
    return;
  }
  const wishlistID = req.params.wishlistID;

  try {
    const cards = await getWishlistCards(userID, wishlistID);

    res.status(200).json(cards);
  } catch (error) {
    if (error instanceof Error) {
      if (
        ["User not a member or creator", "Not found wishlist's group"].includes(
          error.message,
        )
      ) {
        res.status(403).send(error.message);
        return;
      }
      res.status(500).send(error.message);
      return;
    }
    res.status(500).send("Unknown internal Server error");
  }
}

export async function addCardRequest(
  req: AddCardRequestDTO,
  res: AddCardResponseDTO,
): Promise<void> {
  const userID = req.userId;
  if (!userID) {
    res.status(401).send();
    return;
  }

  const cardRaw = req.body;

  try {
    await addCard({
      title: cardRaw.title,
      description: cardRaw.description,
      wishlistID: cardRaw.wishlist_id,
      icon: cardRaw.icon,
      href: cardRaw.href,
      creatorID: userID,
    });

    res.status(201).send();
  } catch (error) {
    if (error instanceof Error) {
      if (
        ["User not a member or creator", "Not found wishlist's group"].includes(
          error.message,
        )
      ) {
        res.status(403).send(error.message);
        return;
      }
      res.status(500).send(error.message);
      return;
    }
    res.status(500).send("Unknown internal Server error");
  }
}
