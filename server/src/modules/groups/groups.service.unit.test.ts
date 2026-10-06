import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import type { UUID } from "../../types/shared.js";

type Repository = typeof import("./groups.repository.js");

// Мокаем функции
const findGroupsByUserIdMock = jest.fn<Repository["findGroupsByUserId"]>();
const createGroupMock = jest.fn<Repository["createGroup"]>();
const findGroupInfoMock = jest.fn<Repository["findGroupInfo"]>();
const findGroupCreatorMock = jest.fn<Repository["findGroupCreator"]>();
const findGroupMembersMock = jest.fn<Repository["findGroupMembers"]>();
type CheckUserGroup = typeof import("../../shared/checkUserGroup.js");

const checkGroupUserAccessMock =
  jest.fn<CheckUserGroup["checkGroupUserAccess"]>();

// Мокаем импорты этих функций
jest.unstable_mockModule("./groups.repository.js", () => ({
  findGroupsByUserId: findGroupsByUserIdMock,
  createGroup: createGroupMock,
  findGroupInfo: findGroupInfoMock,
  findGroupCreator: findGroupCreatorMock,
  findGroupMembers: findGroupMembersMock,
}));
jest.unstable_mockModule("../../shared/checkUserGroup.js", () => ({ checkGroupUserAccess: checkGroupUserAccessMock }));

// Импорт тестируемых модулей после подмены импортов на моки
type GroupsService = typeof import("./groups.service.js");

let getGroupsByUserId: GroupsService["getGroupsByUserId"];
let addGroup: GroupsService["addGroup"];
let getGroupInfo: GroupsService["getGroupInfo"];
let getGroupUsers: GroupsService["getGroupUsers"];
beforeAll(async () => {
  const service = await import("./groups.service.js");

  getGroupsByUserId = service.getGroupsByUserId;
  addGroup = service.addGroup;
  getGroupInfo = service.getGroupInfo;
  getGroupUsers = service.getGroupUsers;
});


describe("groups service", () => {
  const userID = "00000000-0000-0000-0000-000000000001" as UUID;
  const groupID = "00000000-0000-0000-0000-000000000002" as UUID;

  describe("getGroupsByUserId", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test("returns user's groups", async () => {
      const groups = [{ id: groupID, name: "Family" }];
      findGroupsByUserIdMock.mockResolvedValue(groups);

      await expect(getGroupsByUserId(userID)).resolves.toEqual(groups);

      expect(findGroupsByUserIdMock).toHaveBeenCalledWith(userID);
    });
  });

  describe("addGroup", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test("creates a group for the user", async () => {
      await expect(addGroup(userID, { groupName: "Family" })).resolves.toBeUndefined();

      expect(createGroupMock).toHaveBeenCalledWith(userID, "Family");
      expect(createGroupMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("getGroupInfo", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test("getGroupInfo denies access before reading group data", async () => {
      checkGroupUserAccessMock.mockResolvedValue(false);

      await expect(getGroupInfo(userID, groupID)).rejects.toThrow(
        "User not a member or creator",
      );

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(userID, groupID);
      expect(findGroupInfoMock).not.toHaveBeenCalled();
      expect(findGroupCreatorMock).not.toHaveBeenCalled();
      expect(findGroupMembersMock).not.toHaveBeenCalled();
    });

    test("reports creator status: true", async () => {
      checkGroupUserAccessMock.mockResolvedValue(true);
      findGroupInfoMock.mockResolvedValue({ title: "Family", creatorID: userID });

      await expect(getGroupInfo(userID, groupID)).resolves.toEqual(
        { title: "Family", isCreator: true },
      );

      expect(findGroupInfoMock).toHaveBeenCalledWith(groupID);
    });

    test("reports creator status: false", async () => {
      checkGroupUserAccessMock.mockResolvedValue(true);
      findGroupInfoMock.mockResolvedValue({ title: "Family", creatorID: groupID });

      await expect(getGroupInfo(userID, groupID)).resolves.toEqual(
        { title: "Family", isCreator: false },
      );

      expect(findGroupInfoMock).toHaveBeenCalledWith(groupID);
    });
  });

  describe("getGroupUsers", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test("getGroupUsers denies access before reading group data", async () => {
      checkGroupUserAccessMock.mockResolvedValue(false);

      await expect(getGroupUsers(userID, groupID)).rejects.toThrow(
        "User not a member or creator",
      );

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(userID, groupID);
      expect(findGroupInfoMock).not.toHaveBeenCalled();
      expect(findGroupCreatorMock).not.toHaveBeenCalled();
      expect(findGroupMembersMock).not.toHaveBeenCalled();
    });

    test("rejects a group without a creator", async () => {
      checkGroupUserAccessMock.mockResolvedValue(true);
      findGroupCreatorMock.mockResolvedValue(undefined);

      await expect(getGroupUsers(userID, groupID)).rejects.toThrow(
        "Group's creator not found",
      );

      expect(findGroupMembersMock).not.toHaveBeenCalled();
    });

    test("returns creator and filters incomplete members, preserving hash zero", async () => {
      checkGroupUserAccessMock.mockResolvedValue(true);
      const creator = { name: "Creator", hash: 1 };
      findGroupCreatorMock.mockResolvedValue(creator);
      findGroupMembersMock.mockResolvedValue([
        { name: "Member", hash: 0 },
        // SQL left joins can return null even though GroupUser declares required fields.
        {
          name: null,
          hash: 2,
        } as unknown as {
          name: string;
          hash: number;
        },
        { name: "Missing hash", hash: null } as unknown as {
          name: string;
          hash: number;
        },
      ]);
      await expect(getGroupUsers(userID, groupID)).resolves.toEqual(
        { creator, members: [{ name: "Member", hash: 0 }] },
      );

      expect(findGroupCreatorMock).toHaveBeenCalledWith(groupID);
      expect(findGroupMembersMock).toHaveBeenCalledWith(groupID);
    });
  });
});
