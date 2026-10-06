import type { UUID } from "../../types/shared.js";
import type { CardDataRaw } from "./orders.repository.dto.js";
import type { CardData, CardDataInsert } from "./orders.types.js";

export const ORDERS_REPOSITORY = Symbol("ORDERS_REPOSITORY");

export interface OrdersRepositoryInterface {
  findGroupIDByWishlistID(wishlistID: UUID): Promise<UUID | null>;
  findWishlistCards(wishlistID: UUID): Promise<CardDataRaw[]>;
  createCard(card: CardDataInsert): Promise<number>;
}

export const ORDERS_SERVICE = Symbol("ORDERS_SERVICE");

export interface OrdersServiceInterface {
  getWishlistCards(userID: UUID, wishlistID: UUID): Promise<CardData[]>;
  addCard(card: CardDataInsert): Promise<void>;
}
