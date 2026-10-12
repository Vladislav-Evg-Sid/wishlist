import type { UUID } from "../../types/shared.js";
import type { CardDataRaw } from "./orders.repository.dto.js";
import type {
  CardData,
  CardDataInsert,
  CardDataUpdate,
} from "./orders.types.js";

export const ORDERS_REPOSITORY = Symbol("ORDERS_REPOSITORY");

export interface OrdersRepositoryInterface {
  findGroupIDByWishlistID(wishlistID: UUID): Promise<UUID | null>;
  findGroupIDByOrderID(orderID: number): Promise<UUID | null>;
  findWishlistCards(wishlistID: UUID): Promise<CardDataRaw[]>;
  findCardByID(orderID: number): Promise<CardDataRaw | null>;
  createCard(card: CardDataInsert): Promise<number>;
  updateCard(card: CardDataUpdate): Promise<void>;
}

export const ORDERS_SERVICE = Symbol("ORDERS_SERVICE");

export interface OrdersServiceInterface {
  getWishlistCards(userID: UUID, wishlistID: UUID): Promise<CardData[]>;
  addCard(card: CardDataInsert): Promise<void>;
  updateCard(userID: UUID, card: CardDataUpdate): Promise<void>;
}
