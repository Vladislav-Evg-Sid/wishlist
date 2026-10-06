import { describe, expect, test } from "@jest/globals";

import { createWishlist, findGroupWishlists } from "./wishlists.repository.js";
import { createGroup, createGroupWithCreatorID } from "../../../tests/integration/fixtures/groups.js";
import { db } from "../../db/knex.js";
import { TABLES } from "../../db/schema.js";
import type { UUID } from "../../types/shared.js";


describe("wishlists repository", () => {
  const missingID = "00000000-0000-0000-0000-000000000000" as UUID;

  describe("createWishlist", () => {
    test("persists wishlist fields and defaults", async () => {
      const { creatorID, groupID } = await createGroup();
      await createWishlist({ creatorID, groupID, name: "Birthday" });
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
        createWishlist({ creatorID: missingID, groupID: groupID, name: "Birthday" }),
      ).rejects.toMatchObject({
        code: "23503",
        constraint: "wishlist_creator_id_foreign",
      });
    });

    test("rejects missing group", async () => {
      const { creatorID, groupID } = await createGroup();
      await expect(createWishlist({
        creatorID: creatorID,
        groupID: missingID,
        name: "Birthday",
      })).rejects.toMatchObject({
        code: "23503",
        constraint: "wishlist_group_id_foreign",
      });
    });
  });

  describe("findGroupWishlists", () => {
    test("returns no wishlists for missing or empty group", async () => {
      const { groupID } = await createGroup();
      await expect(findGroupWishlists(missingID)).resolves.toEqual([]);
      await expect(findGroupWishlists(groupID)).resolves.toEqual([]);
    });

    test("returns only wishlists from requested group", async () => {
      const { creatorID, groupID } = await createGroup();
      const otherGroupID = await createGroupWithCreatorID(creatorID);
      await createWishlist({ creatorID, groupID, name: "Birthday" });
      await createWishlist({ creatorID, groupID, name: "Holiday" });
      await createWishlist({ creatorID, groupID: otherGroupID, name: "Other" });
      const rows = await db(TABLES.wishlist).where({ group_id: groupID });
      const lists = await findGroupWishlists(groupID);

      expect(lists).toHaveLength(2);
      expect(lists).toEqual(
        expect.arrayContaining(rows.map(row => ({ id: row.id, title: row.title }))),
      );
    });
  });
});
