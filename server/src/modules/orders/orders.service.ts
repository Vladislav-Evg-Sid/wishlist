import { Inject, Injectable } from "@nestjs/common";

import { checkGroupUserAccess } from "../../shared/checkUserGroup.js";
import {
  DataConflictError,
  ForbidenError,
  NotFoundError,
} from "../../shared/errors.js";
import type { UUID } from "../../types/shared.js";
import type {
  CardData,
  CardDataInsert,
  CardDataUpdate,
} from "./orders.types.js";
import {
  ORDERS_REPOSITORY,
  type OrdersRepositoryInterface,
  type OrdersServiceInterface,
} from "./orders.di.js";

@Injectable()
export class OrdersService implements OrdersServiceInterface {
  constructor(
    @Inject(ORDERS_REPOSITORY)
    private readonly ordersRepository: OrdersRepositoryInterface,
  ) {}

  private async checkUserAcess(
    userID: UUID,
    wishlistOrOrderID: UUID | number,
  ): Promise<void> {
    let groupID: UUID | null;
    if (typeof wishlistOrOrderID === "number") {
      groupID =
        await this.ordersRepository.findGroupIDByOrderID(wishlistOrOrderID);
    } else {
      groupID =
        await this.ordersRepository.findGroupIDByWishlistID(wishlistOrOrderID);
    }
    if (!groupID) {
      throw new NotFoundError("group not found");
    }

    const userAcess = await checkGroupUserAccess(userID, groupID);
    if (!userAcess) {
      throw new ForbidenError("user not a creator or member of group");
    }
  }

  async getWishlistCards(userID: UUID, wishlistID: UUID): Promise<CardData[]> {
    await this.checkUserAcess(userID, wishlistID);

    const cardsRaw = await this.ordersRepository.findWishlistCards(wishlistID);

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
    await this.checkUserAcess(card.creatorID, card.wishlistID);

    await this.ordersRepository.createCard(card);
  }

  async updateCard(userID: UUID, card: CardDataUpdate): Promise<void> {
    await this.checkUserAcess(userID, card.id);

    const cardData = await this.ordersRepository.findCardByID(card.id);
    if (!cardData) {
      throw new NotFoundError("card not found");
    }

    if (userID !== cardData.author_id) {
      throw new ForbidenError("user is not a creator");
    }

    await this.ordersRepository.updateCard(card);
  }

  async deleteCard(userID: UUID, cardID: number): Promise<void> {
    await this.checkUserAcess(userID, cardID);

    const cardData = await this.ordersRepository.findCardByID(cardID);
    if (!cardData) {
      throw new NotFoundError("card not found");
    }

    if (userID !== cardData.author_id) {
      throw new ForbidenError("user is not a creator");
    }

    this.ordersRepository.deleteCard(cardID);
  }

  async reserveOrder(userID: UUID, cardID: number): Promise<void> {
    await this.checkUserAcess(userID, cardID);

    const cardData = await this.ordersRepository.findCardByID(cardID);
    if (!cardData) {
      throw new NotFoundError("card not found");
    }

    if (cardData.author_id === userID) {
      throw new ForbidenError("card's author can not reserve card");
    }

    if (cardData.status !== "Свободно") {
      throw new DataConflictError("card alredy reserved or gifted");
    }

    await this.ordersRepository.reserveCard(cardID, userID);
  }

  async unReserveOrder(userID: UUID, cardID: number): Promise<void> {
    await this.checkUserAcess(userID, cardID);

    const cardData = await this.ordersRepository.findCardByID(cardID);
    if (!cardData) {
      throw new NotFoundError("card not found");
    }
    if (cardData.author_id === userID) {
      throw new ForbidenError("card's author can not unreserve card");
    }
    if (!cardData.reserved_by) {
      throw new DataConflictError("card alredy unreserved");
    }
    if (cardData.status === "Подарено") {
      throw new DataConflictError("card alredy gifted");
    }
    if (cardData.reserved_by !== userID) {
      throw new ForbidenError("only reserver can unreserve card");
    }

    await this.ordersRepository.unReserveCard(cardID);
  }

  async markOrderAsGifted(userID: UUID, cardID: number): Promise<void> {
    await this.checkUserAcess(userID, cardID);

    const cardData = await this.ordersRepository.findCardByID(cardID);
    if (!cardData) {
      throw new NotFoundError("card not found");
    }
    if (cardData.author_id === userID) {
      throw new ForbidenError("card's author can not give card");
    }
    if (!cardData.reserved_by) {
      throw new DataConflictError("card is unreserved");
    }
    if (cardData.reserved_by !== userID) {
      throw new ForbidenError("only reserver can give card");
    }
    if (cardData.status === "Подарено") {
      throw new DataConflictError("card alredy gifted");
    }

    await this.ordersRepository.giveCard(cardID);
  }
}
