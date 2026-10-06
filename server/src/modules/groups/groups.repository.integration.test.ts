import { describe, expect, test } from "@jest/globals";

import {
  createGroup,
  findGroupsByUserId,
  findGroupInfo,
  findGroupCreator,
  findGroupMembers,
} from "./groups.repository.js";
import {
  createGroup as createGroupFixture,
  createGroupWithCreatorID,
  addGroupMember,
} from "../../../tests/integration/fixtures/groups.js";
import { createUser } from "../../../tests/integration/fixtures/users.js";
import { db } from "../../db/knex.js";
import { TABLES, GROUPS_COLUMNS } from "../../db/schema.js";
import type { UUID } from "../../types/shared.js";

describe("groups repository", () => {
  const missingID = "00000000-0000-0000-0000-000000000000" as UUID;

  describe("createGroup", () => {
    test("success create group", async () => {
      const creatorID = await createUser();

      await createGroup(creatorID, "Family");

      const groups = await db(TABLES.groups).select("*");
      expect(groups).toHaveLength(1);
      expect(groups[0]).toMatchObject({
        [GROUPS_COLUMNS.title]: "Family",
        [GROUPS_COLUMNS.creator_id]: creatorID,
        [GROUPS_COLUMNS.id]: expect.any(String),
        [GROUPS_COLUMNS.created_at]: expect.any(Date),
      });
    });

    test("throw when creator does not exist", async () => {
      await expect(createGroup(missingID, "Family")).rejects.toMatchObject({
        code: "23503",
        constraint: "groups_creator_id_foreign",
      });
    });
  });

  describe("findGroupsByUserId", () => {
    test("returns empty groups when user does not exist", async () => {
      await createGroupFixture();

      const groups = await findGroupsByUserId(missingID);

      expect(groups).toEqual([]);
    });

    test("returns owned and joined groups", async () => {
      const { creatorID, groupID } = await createGroupFixture();
      const otherID = await createUser({ username: "Other", email: "other@example.com" });
      const joinedID = await createGroupWithCreatorID(otherID);
      await addGroupMember(joinedID, creatorID);
      await createGroupWithCreatorID(otherID);

      const groups = await findGroupsByUserId(creatorID);

      expect(groups).toHaveLength(2);
      expect(groups).toEqual(expect.arrayContaining([
        { id: groupID, title: "Vlad's group" },
        { id: joinedID, title: "Vlad's group" },
      ]));
    });
  });

  describe("findGroupInfo", () => {
    test("returns undefined when group does not exist", async () => {
      const group = await findGroupInfo(missingID);

      expect(group).toBeUndefined();
    });

    test("returns group information", async () => {
      const { creatorID, groupID } = await createGroupFixture();

      const group = await findGroupInfo(groupID);

      expect(group).toEqual({ title: "Vlad's group", creatorID });
    });
  });

  describe("findGroupCreator", () => {
    test("returns undefined when group does not exist", async () => {
      const creator = await findGroupCreator(missingID);

      expect(creator).toBeUndefined();
    });

    test("returns group creator", async () => {
      const { groupID } = await createGroupFixture();

      const creator = await findGroupCreator(groupID);

      expect(creator).toEqual({ name: "Vlad", hash: 123 });
    });
  });

  describe("findGroupMembers", () => {
    test("returns empty members when group does not exist", async () => {
      const members = await findGroupMembers(missingID);

      expect(members).toEqual([]);
    });

    test("returns null member fields when group has no members", async () => {
      const { groupID } = await createGroupFixture();

      const members = await findGroupMembers(groupID);

      expect(members).toEqual([{ name: null, hash: null }]);
    });

    test("returns only requested group's members", async () => {
      const { creatorID, groupID } = await createGroupFixture();
      const memberID = await createUser({ username: "Member", email: "member@example.com", user_hash: 0 });
      const otherID = await createUser({ username: "Other", email: "other@example.com" });
      await addGroupMember(groupID, memberID);
      const otherGroupID = await createGroupWithCreatorID(creatorID);
      await addGroupMember(otherGroupID, otherID);

      const members = await findGroupMembers(groupID);

      expect(members).toEqual([{ name: "Member", hash: 0 }]);
    });
  });
});
