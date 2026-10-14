import { describe, expect, test } from "@jest/globals";

import { WishlistsRepository } from "./wishlists.repository.js";
import {
  createGroup,
  createGroupWithCreatorID,
} from "../../../tests/integration/fixtures/groups.js";
import { createWishlist } from "../../../tests/integration/fixtures/wishlists.js";
import { db } from "../../db/knex.js";
import { TABLES, WISHILST_COLUMNS } from "../../db/schema.js";
import type { UUID } from "../../types/shared.js";

const wishlistsRepository = new WishlistsRepository();

describe("wishlists repository", () => {
  const missingID = "00000000-0000-0000-0000-000000000000" as UUID;

  describe("createWishlist", () => {
    test("persists wishlist fields and defaults", async () => {
      const { creatorID, groupID } = await createGroup();
      await wishlistsRepository.createWishlist({
        creatorID,
        groupID,
        name: "Birthday",
      });
      const rows = await db(TABLES.wishlist).select("*");

      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({
        title: "Birthday",
        creator_id: creatorID,
        group_id: groupID,
        is_deleted: false,
        id: expect.any(String),
        created_at: expect.any(Date),
      });
    });

    test("rejects missing creator", async () => {
      const { creatorID, groupID } = await createGroup();
      await expect(
        wishlistsRepository.createWishlist({
          creatorID: missingID,
          groupID: groupID,
          name: "Birthday",
        }),
      ).rejects.toMatchObject({
        code: "23503",
        constraint: "wishlist_creator_id_foreign",
      });
    });

    test("rejects missing group", async () => {
      const { creatorID, groupID } = await createGroup();
      await expect(
        wishlistsRepository.createWishlist({
          creatorID: creatorID,
          groupID: missingID,
          name: "Birthday",
        }),
      ).rejects.toMatchObject({
        code: "23503",
        constraint: "wishlist_group_id_foreign",
      });
    });
  });

  describe("findGroupWishlists", () => {
    test("returns no wishlists for missing or empty group", async () => {
      const { groupID } = await createGroup();
      await expect(
        wishlistsRepository.findGroupWishlists(missingID),
      ).resolves.toEqual([]);
      await expect(
        wishlistsRepository.findGroupWishlists(groupID),
      ).resolves.toEqual([]);
    });

    test("returns only wishlists from requested group", async () => {
      const { creatorID, groupID } = await createGroup();
      const otherGroupID = await createGroupWithCreatorID(creatorID);
      await wishlistsRepository.createWishlist({
        creatorID,
        groupID,
        name: "Birthday",
      });
      await wishlistsRepository.createWishlist({
        creatorID,
        groupID,
        name: "Holiday",
      });
      await wishlistsRepository.createWishlist({
        creatorID,
        groupID: otherGroupID,
        name: "Other",
      });
      const rows = await db(TABLES.wishlist).where({ group_id: groupID });
      const lists = await wishlistsRepository.findGroupWishlists(groupID);

      expect(lists).toHaveLength(2);
      expect(lists).toEqual(
        expect.arrayContaining(
          rows.map((row) => ({ id: row.id, title: row.title })),
        ),
      );
    });
  });

  describe("findWishlistInfo", () => {
    test("sucess finding wishlist info", async () => {
      const { creatorID, wishlistID } = await createWishlist();
      const wishlistTitle = await db(TABLES.wishlist)
        .select({ title: WISHILST_COLUMNS.title })
        .where(WISHILST_COLUMNS.id, wishlistID)
        .first();

      const returnedData =
        await wishlistsRepository.findWishlistInfo(wishlistID);

      expect(returnedData).toStrictEqual({
        title: wishlistTitle.title,
        creatorID,
      });
    });
  });

  describe("deleteWishlist", () => {
    test("sucess deliting wishlist", async () => {
      const { wishlistID } = await createWishlist();
      const wishlistsBeforeDeliting = await db(TABLES.wishlist)
        .select("*")
        .where(WISHILST_COLUMNS.id, wishlistID);

      await expect(
        wishlistsRepository.deleteWishlist(wishlistID),
      ).resolves.toBeUndefined();

      const wishlistsAfterDeliting = await db(TABLES.wishlist)
        .select("*")
        .where(WISHILST_COLUMNS.id, wishlistID);

      expect(wishlistsBeforeDeliting.length).toBe(1);
      expect(wishlistsAfterDeliting.length).toBe(0);
    });
  });

  describe("updateWishlistName", () => {
    const newWishlistTitle = "some new wishlist title";

    test("sucess updating wishlist name", async () => {
      const { wishlistID } = await createWishlist();

      await expect(
        wishlistsRepository.updateWishlistName(wishlistID, newWishlistTitle),
      ).resolves.toBeUndefined();

      const realWishlistTitle = await db(TABLES.wishlist)
        .select({ title: WISHILST_COLUMNS.title })
        .where(WISHILST_COLUMNS.id, wishlistID)
        .first();

      expect(realWishlistTitle.title).toBe(newWishlistTitle);
    });
  });

  describe("findGroupIDByWishlistID", () => {
    test("sucess finding wishlist info", async () => {
      const { groupID, wishlistID } = await createWishlist();

      const returnedGroupID =
        await wishlistsRepository.findGroupIDByWishlistID(wishlistID);

      expect(returnedGroupID).toBe(groupID);
    });

    test("finding unknown group", async () => {
      const returnedGroupID =
        await wishlistsRepository.findGroupIDByWishlistID(missingID);

      expect(returnedGroupID).toBe(null);
    });
  });
});
