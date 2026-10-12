import { describe, expect, test } from "@jest/globals";

import { OrdersRepository } from "./orders.repository.js";
import { createWishlist } from "../../../tests/integration/fixtures/wishlists.js";
import { db } from "../../db/knex.js";
import { CARD_COLUMNS, TABLES, USER_COLUMNS } from "../../db/schema.js";
import {
  createCards,
  createCardWithParantWishlistID,
} from "../../../tests/integration/fixtures/card.js";
import type { UUID } from "../../types/shared.js";
import type { OrdersRepositoryInterface } from "./orders.di.js";

const ordersRepository: OrdersRepositoryInterface = new OrdersRepository();

describe("orders repository", () => {
  describe("findGroupIDByWishlistID", () => {
    test("returns null when wishlist does not exist", async () => {
      const wishlistID = "00000000-0000-0000-0000-000000000000" as UUID;

      const groupID =
        await ordersRepository.findGroupIDByWishlistID(wishlistID);

      expect(groupID).toBeNull();
    });

    test("returns group ID when wishlist exist", async () => {
      const { groupID, wishlistID } = await createWishlist();

      const findedGroupID =
        await ordersRepository.findGroupIDByWishlistID(wishlistID);

      expect(findedGroupID).toBe(groupID);
    });
  });

  describe("findGroupIDByOrderID", () => {
    test("returns null when order does not exist", async () => {
      await createCards(1);
      const orderID = 0;

      const groupID = await ordersRepository.findGroupIDByOrderID(orderID);

      expect(groupID).toBeNull();
    });

    test("returns group ID when order exists", async () => {
      const { creatorID, groupID, wishlistID } = await createWishlist();
      const cards = await createCardWithParantWishlistID(
        wishlistID,
        creatorID,
        3,
      );
      const orderID = cards[1].id;

      const findedGroupID =
        await ordersRepository.findGroupIDByOrderID(orderID);

      expect(findedGroupID).toBe(groupID);
    });
  });

  describe("findCardByID", () => {
    test("returns null when card does not exist", async () => {
      await createCards(1);
      const cardID = 0;

      const card = await ordersRepository.findCardByID(cardID);

      expect(card).toBeNull();
    });

    test("returns mapped card when card exists", async () => {
      const { cards, creatorID } = await createCards(3);
      const card = cards[1];
      const createdCard = await db(TABLES.card)
        .where(CARD_COLUMNS.id, card.id)
        .first();
      const user = await db(TABLES.users)
        .select({
          id: USER_COLUMNS.id,
          name: USER_COLUMNS.username,
          email: USER_COLUMNS.email,
          hash: USER_COLUMNS.user_hash,
        })
        .where(USER_COLUMNS.id, creatorID)
        .first();

      const findedCard = await ordersRepository.findCardByID(card.id);

      expect(findedCard).toStrictEqual({
        id: card.id,
        title: card.title,
        icon: card.icon,
        description: card.description,
        created_at: createdCard.created_at,
        status: "Свободно",
        author_id: user.id,
        author_name: user.name,
        author_email: user.email,
        author_hash: user.hash,
        reserved_by: null,
        href: card.href,
      });
    });

    test("returns reserved card with null href", async () => {
      const { cards, creatorID } = await createCards(1);
      const cardID = cards[0].id;
      await db(TABLES.card)
        .where(CARD_COLUMNS.id, cardID)
        .update({
          [CARD_COLUMNS.status]: "Забронировано",
          [CARD_COLUMNS.reserved_by]: creatorID,
          [CARD_COLUMNS.href]: null,
        });

      const card = await ordersRepository.findCardByID(cardID);

      expect(card).toMatchObject({
        id: cardID,
        status: "Забронировано",
        reserved_by: creatorID,
        href: null,
      });
    });
  });

  describe("createCard", () => {
    const cardRaw = {
      title: "some dift",
      description: "some interesting gift",
      icon: "some icon code",
      href: "",
    };

    test("success create card", async () => {
      const { creatorID, wishlistID } = await createWishlist();
      const card = {
        ...cardRaw,
        creatorID,
        wishlistID,
      };

      const cardID = await ordersRepository.createCard(card);

      expect(cardID).toBeDefined();
      expect(cardID).toBe(1);
      const createdCard = await db(TABLES.card)
        .where(CARD_COLUMNS.id, cardID)
        .first();
      expect(createdCard).toBeDefined();
      expect(createdCard).toMatchObject({
        [CARD_COLUMNS.title]: card.title,
        [CARD_COLUMNS.description]: card.description,
        [CARD_COLUMNS.icon]: card.icon,
        [CARD_COLUMNS.href]: card.href,
        [CARD_COLUMNS.wishlist_id]: card.wishlistID,
        [CARD_COLUMNS.creator_id]: card.creatorID,
      });
    });

    test("create card with not existing creator", async () => {
      const { wishlistID } = await createWishlist();
      const creatorID = "00000000-0000-0000-0000-000000000000" as UUID;
      const card = {
        ...cardRaw,
        creatorID,
        wishlistID,
      };

      await expect(ordersRepository.createCard(card)).rejects.toMatchObject({
        code: "23503",
        constraint: "card_creator_id_foreign",
      });
    });

    test("create card with not existing wishlist", async () => {
      const { creatorID } = await createWishlist();
      const wishlistID = "00000000-0000-0000-0000-000000000000" as UUID;
      const card = {
        ...cardRaw,
        creatorID,
        wishlistID,
      };

      await expect(ordersRepository.createCard(card)).rejects.toMatchObject({
        code: "23503",
        constraint: "card_wishlist_id_foreign",
      });
    });
  });

  describe("findWishlistCards", () => {
    test("founding unknown wishlist's card", async () => {
      const wishlistID = "00000000-0000-0000-0000-000000000000" as UUID;

      const cards = await ordersRepository.findWishlistCards(wishlistID);

      expect(cards.length).toBe(0);
    });

    test("find exists cards", async () => {
      const { cards, wishlistID, creatorID } = await createCards(3);

      const findedCards = await ordersRepository.findWishlistCards(wishlistID);

      const user = await db(TABLES.users)
        .select({
          id: USER_COLUMNS.id,
          name: USER_COLUMNS.username,
          email: USER_COLUMNS.email,
          hash: USER_COLUMNS.user_hash,
        })
        .where(USER_COLUMNS.id, creatorID)
        .first();
      const compairCards = cards.map((card, i) => ({
        id: card.id,
        title: card.title,
        icon: card.icon,
        description: card.description,
        created_at: findedCards[i]?.created_at,
        status: "Свободно",
        author_id: user.id,
        author_name: user.name,
        author_email: user.email,
        author_hash: user.hash,
        reserved_by: null,
        href: card.href,
      }));
      expect(findedCards).toStrictEqual(compairCards);
    });
  });

  describe("updateCard", () => {
    const updatedCardData = {
      title: "Обновлённое название",
      description: "Новое описание",
      icon: "Другая иконка",
      href: "https://example.com/some-shop/some-order",
    };

    test("correct update card", async () => {
      const { cards, wishlistID, creatorID } = await createCards(1);
      const cardID = cards[0].id;

      await ordersRepository.updateCard({
        id: cardID,
        ...updatedCardData,
      });

      const createdCard = await db(TABLES.card)
        .where(CARD_COLUMNS.id, cardID)
        .first();
      expect(createdCard).toBeDefined();
      expect(createdCard).toMatchObject({
        [CARD_COLUMNS.title]: updatedCardData.title,
        [CARD_COLUMNS.description]: updatedCardData.description,
        [CARD_COLUMNS.icon]: updatedCardData.icon,
        [CARD_COLUMNS.href]: updatedCardData.href,
        [CARD_COLUMNS.wishlist_id]: wishlistID,
        [CARD_COLUMNS.creator_id]: creatorID,
      });
    });
  });

  describe("deleteCard", () => {
    test("correct delete card", async () => {
      const { cards } = await createCards(1);

      await ordersRepository.deleteCard(cards[0].id);

      const realCards = await db(TABLES.card).select("*");

      expect(realCards.length).toBe(0);
    });
  });
});
