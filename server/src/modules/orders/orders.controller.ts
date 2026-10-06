import {
  ForbidenError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/errors.js";
import type {
  AddCardRequestDTO,
  AddCardResponseDTO,
  GetWishlistCardsRequestDTO,
  GetWishlistCardsResponseDTO,
} from "./orders.http.dto.js";
import { addCard, getWishlistCards } from "./orders.service.js";

export async function getWishlistCardsRequest(
  req: GetWishlistCardsRequestDTO,
  res: GetWishlistCardsResponseDTO,
): Promise<void> {
  const userID = req.userId;
  if (!userID) {
    throw new UnauthorizedError("");
  }
  const { wishlistID } = res.locals.validateParams;

  const cards = await getWishlistCards(userID, wishlistID);
  res.status(200).json(cards);
}

export async function addCardRequest(
  req: AddCardRequestDTO,
  res: AddCardResponseDTO,
): Promise<void> {
  const userID = req.userId;
  if (!userID) {
    throw new UnauthorizedError("");
  }

  const cardData = res.locals.validateBody;
  await addCard({
    ...cardData,
    creatorID: userID,
  });

  res.status(201).send();
}
