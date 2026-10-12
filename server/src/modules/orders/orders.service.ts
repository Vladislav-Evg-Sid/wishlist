import { Inject, Injectable } from "@nestjs/common";

import { checkGroupUserAccess } from "../../shared/checkUserGroup.js";
import { ForbidenError, NotFoundError } from "../../shared/errors.js";
import type { UUID } from "../../types/shared.js";
import type { CardData, CardDataInsert } from "./orders.types.js";
import {
  ORDERS_REPOSITORY,
  type OrdersRepositoryInterface,
  type OrdersServiceInterface,
} from "./orders.di.js";

@Injectable()
export class OrdersService implements OrdersServiceInterface {
  constructor(
    @Inject(ORDERS_REPOSITORY)
    private readonly serviceRepository: OrdersRepositoryInterface,
  ) {}

  async getWishlistCards(userID: UUID, wishlistID: UUID): Promise<CardData[]> {
    const groupID =
      await this.serviceRepository.findGroupIDByWishlistID(wishlistID);
    if (!groupID) {
      throw new NotFoundError("Not found wishlist's group");
    }

    const userAccess = await checkGroupUserAccess(userID, groupID);
    if (!userAccess) {
      throw new ForbidenError("User not a member or creator");
    }

    const cardsRaw = await this.serviceRepository.findWishlistCards(wishlistID);

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

  async addCard(card: CardDataInsert): Promise<void> {
    const groupID = await this.serviceRepository.findGroupIDByWishlistID(
      card.wishlistID,
    );
    if (!groupID) {
      throw new NotFoundError("Not found wishlist's group");
    }

    const userAccess = await checkGroupUserAccess(card.creatorID, groupID);
    if (!userAccess) {
      throw new ForbidenError("User not a member or creator");
    }

    await this.serviceRepository.createCard(card);
  }
}
