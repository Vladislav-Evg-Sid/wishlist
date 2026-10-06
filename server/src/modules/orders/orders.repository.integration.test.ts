import { describe, expect, test } from "@jest/globals";

import {
  createCard,
  findGroupIDByWishlistID,
  findWishlistCards,
} from "./orders.repository.js";
import { createWishlist } from "../../../tests/integration/fixtures/wishlists.js";
import { db } from "../../db/knex.js";
import { CARD_COLUMNS, TABLES, USER_COLUMNS } from "../../db/schema.js";
import { createCards } from "../../../tests/integration/fixtures/card.js";
import type { UUID } from "../../types/shared.js";

describe("orders repository", () => {
  describe("findGroupIDByWishlistID", () => {
    test("returns null when wishlist does not exist", async () => {
      const wishlistID = "00000000-0000-0000-0000-000000000000" as UUID;

      const groupID = await findGroupIDByWishlistID(wishlistID);

      expect(groupID).toBeNull();
    });

    test("returns group ID when wishlist exist", async () => {
      const { groupID, wishlistID } = await createWishlist();

      const findedGroupID = await findGroupIDByWishlistID(wishlistID);

      expect(findedGroupID).toBe(groupID);
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

      const cardID = await createCard(card);

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

      await expect(createCard(card)).rejects.toMatchObject({
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

      await expect(createCard(card)).rejects.toMatchObject({
        code: "23503",
        constraint: "card_wishlist_id_foreign",
      });
    });
  });

  describe("findWishlistCards", () => {
    test("founding unknown wishlist's card", async () => {
      const wishlistID = "00000000-0000-0000-0000-000000000000" as UUID;

      const cards = await findWishlistCards(wishlistID);

      expect(cards.length).toBe(0);
    });

    test("find exists cards", async () => {
      const { cards, wishlistID, creatorID } = await createCards(3);

      const findedCards = await findWishlistCards(wishlistID);

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
});
