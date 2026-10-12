import { describe, expect, test } from "@jest/globals";

import { GroupsRepository } from "./groups.repository.js";
import {
  createGroup as createGroupFixture,
  createGroupWithCreatorID,
  addGroupMember,
} from "../../../tests/integration/fixtures/groups.js";
import { createUser } from "../../../tests/integration/fixtures/users.js";
import { createWishlistWithParantGroupID } from "../../../tests/integration/fixtures/wishlists.js";
import { db } from "../../db/knex.js";
import { TABLES, GROUPS_COLUMNS } from "../../db/schema.js";
import type { UUID } from "../../types/shared.js";

const groupsRepository = new GroupsRepository();

describe("groups repository", () => {
  const missingID = "00000000-0000-0000-0000-000000000000" as UUID;

  describe("updateGroupName", () => {
    test("updates only requested group's name", async () => {
      const { creatorID, groupID } = await createGroupFixture();
      const otherGroupID = await createGroupWithCreatorID(creatorID);
      const groupBeforeUpdate = await db(TABLES.groups)
        .where(GROUPS_COLUMNS.id, groupID)
        .first();
      const otherGroupBeforeUpdate = await db(TABLES.groups)
        .where(GROUPS_COLUMNS.id, otherGroupID)
        .first();
      const newName = "Новое название группы";

      await groupsRepository.updateGroupName(groupID, newName);

      const updatedGroup = await db(TABLES.groups)
        .where(GROUPS_COLUMNS.id, groupID)
        .first();
      const otherGroup = await db(TABLES.groups)
        .where(GROUPS_COLUMNS.id, otherGroupID)
        .first();
      expect(updatedGroup).toStrictEqual({
        ...groupBeforeUpdate,
        [GROUPS_COLUMNS.title]: newName,
      });
      expect(otherGroup).toStrictEqual(otherGroupBeforeUpdate);
    });

    test("does not change groups when group does not exist", async () => {
      await createGroupFixture();
      const groupsBeforeUpdate = await db(TABLES.groups).select("*");

      await groupsRepository.updateGroupName(missingID, "New name");

      const groups = await db(TABLES.groups).select("*");
      expect(groups).toStrictEqual(groupsBeforeUpdate);
    });
  });

  describe("deleteGroup", () => {
    test("deletes only requested group and preserves creator", async () => {
      const { creatorID, groupID } = await createGroupFixture();
      const otherGroupID = await createGroupWithCreatorID(creatorID);
      const otherGroupBeforeDelete = await db(TABLES.groups)
        .where(GROUPS_COLUMNS.id, otherGroupID)
        .first();

      await groupsRepository.deleteGroup(groupID);

      const deletedGroup = await db(TABLES.groups)
        .where(GROUPS_COLUMNS.id, groupID)
        .first();
      const groups = await db(TABLES.groups).select("*");
      const creator = await db(TABLES.users).where("id", creatorID).first();
      expect(deletedGroup).toBeUndefined();
      expect(groups).toStrictEqual([otherGroupBeforeDelete]);
      expect(creator).toBeDefined();
    });

    test("does not delete groups when group does not exist", async () => {
      await createGroupFixture();
      const groupsBeforeDelete = await db(TABLES.groups).select("*");

      await groupsRepository.deleteGroup(missingID);

      const groups = await db(TABLES.groups).select("*");
      expect(groups).toStrictEqual(groupsBeforeDelete);
    });

    test("throw when group has members", async () => {
      const { creatorID, groupID } = await createGroupFixture();
      await addGroupMember(groupID, creatorID);

      await expect(groupsRepository.deleteGroup(groupID)).rejects.toMatchObject({
        code: "23503",
        constraint: "group_member_group_id_foreign",
      });

      const group = await db(TABLES.groups)
        .where(GROUPS_COLUMNS.id, groupID)
        .first();
      expect(group).toBeDefined();
    });

    test("throw when group has wishlists", async () => {
      const { creatorID, groupID } = await createGroupFixture();
      await createWishlistWithParantGroupID(groupID, creatorID);

      await expect(groupsRepository.deleteGroup(groupID)).rejects.toMatchObject({
        code: "23503",
        constraint: "wishlist_group_id_foreign",
      });

      const group = await db(TABLES.groups)
        .where(GROUPS_COLUMNS.id, groupID)
        .first();
      expect(group).toBeDefined();
    });
  });

  describe("createGroup", () => {
    test("success create group", async () => {
      const creatorID = await createUser();

      await groupsRepository.createGroup(creatorID, "Family");

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
      await expect(
        groupsRepository.createGroup(missingID, "Family"),
      ).rejects.toMatchObject({
        code: "23503",
        constraint: "groups_creator_id_foreign",
      });
    });
  });

  describe("findGroupsByUserId", () => {
    test("returns empty groups when user does not exist", async () => {
      await createGroupFixture();

      const groups = await groupsRepository.findGroupsByUserId(missingID);

      expect(groups).toEqual([]);
    });

    test("returns owned and joined groups", async () => {
      const { creatorID, groupID } = await createGroupFixture();
      const otherID = await createUser({
        username: "Other",
        email: "other@example.com",
      });
      const joinedID = await createGroupWithCreatorID(otherID);
      await addGroupMember(joinedID, creatorID);
      await createGroupWithCreatorID(otherID);

      const groups = await groupsRepository.findGroupsByUserId(creatorID);

      expect(groups).toHaveLength(2);
      expect(groups).toEqual(
        expect.arrayContaining([
          { id: groupID, title: "Vlad's group" },
          { id: joinedID, title: "Vlad's group" },
        ]),
      );
    });
  });

  describe("findGroupInfo", () => {
    test("returns undefined when group does not exist", async () => {
      const group = await groupsRepository.findGroupInfo(missingID);

      expect(group).toBeUndefined();
    });

    test("returns group information", async () => {
      const { creatorID, groupID } = await createGroupFixture();

      const group = await groupsRepository.findGroupInfo(groupID);

      expect(group).toEqual({ title: "Vlad's group", creatorID });
    });
  });

  describe("findGroupCreator", () => {
    test("returns undefined when group does not exist", async () => {
      const creator = await groupsRepository.findGroupCreator(missingID);

      expect(creator).toBeUndefined();
    });

    test("returns group creator", async () => {
      const { groupID } = await createGroupFixture();

      const creator = await groupsRepository.findGroupCreator(groupID);

      expect(creator).toEqual({ name: "Vlad", hash: 123 });
    });
  });

  describe("findGroupMembers", () => {
    test("returns empty members when group does not exist", async () => {
      const members = await groupsRepository.findGroupMembers(missingID);

      expect(members).toEqual([]);
    });

    test("returns null member fields when group has no members", async () => {
      const { groupID } = await createGroupFixture();

      const members = await groupsRepository.findGroupMembers(groupID);

      expect(members).toEqual([{ name: null, hash: null }]);
    });

    test("returns only requested group's members", async () => {
      const { creatorID, groupID } = await createGroupFixture();
      const memberID = await createUser({
        username: "Member",
        email: "member@example.com",
        user_hash: 0,
      });
      const otherID = await createUser({
        username: "Other",
        email: "other@example.com",
      });
      await addGroupMember(groupID, memberID);
      const otherGroupID = await createGroupWithCreatorID(creatorID);
      await addGroupMember(otherGroupID, otherID);

      const members = await groupsRepository.findGroupMembers(groupID);

      expect(members).toEqual([{ name: "Member", hash: 0 }]);
    });
  });
});
