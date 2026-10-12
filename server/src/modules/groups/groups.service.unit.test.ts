import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import type { UUID } from "../../types/shared.js";
import type { GroupsRepositoryInterface } from "./groups.di.js";
import type { GroupData, GroupUser } from "./groups.types.js";
import type { GroupInfoRaw } from "./groups.repository.dto.js";
import { ForbidenError, NotFoundError } from "../../shared/errors.js";

// Мокаем функции
type CheckUserGroup = typeof import("../../shared/checkUserGroup.js");
const checkGroupUserAccessMock =
  jest.fn<CheckUserGroup["checkGroupUserAccess"]>();

const findGroupsByUserIdMock =
  jest.fn<(userID: UUID) => Promise<GroupData[]>>();
const createGroupMock =
  jest.fn<(userID: UUID, groupName: string) => Promise<string>>();
const findGroupInfoMock = jest.fn<(groupID: UUID) => Promise<GroupInfoRaw>>();
const findGroupCreatorMock =
  jest.fn<(groupID: UUID) => Promise<GroupUser | undefined>>();
const findGroupMembersMock = jest.fn<(groupID: UUID) => Promise<GroupUser[]>>();
const updateGroupNameMock =
  jest.fn<GroupsRepositoryInterface["updateGroupName"]>();
const deleteGroupMock = jest.fn<GroupsRepositoryInterface["deleteGroup"]>();
class GroupsRepository implements GroupsRepositoryInterface {
  constructor(
    public readonly findGroupsByUserId: any,
    public readonly createGroup: any,
    public readonly findGroupInfo: any,
    public readonly findGroupCreator: any,
    public readonly findGroupMembers: any,
    public readonly updateGroupName: GroupsRepositoryInterface["updateGroupName"],
    public readonly deleteGroup: GroupsRepositoryInterface["deleteGroup"],
  ) {}
}
const groupsRepository = new GroupsRepository(
  findGroupsByUserIdMock,
  createGroupMock,
  findGroupInfoMock,
  findGroupCreatorMock,
  findGroupMembersMock,
  updateGroupNameMock,
  deleteGroupMock,
);

// Мокаем импорты этих функций
jest.unstable_mockModule("./groups.repository.js", () => ({
  findGroupsByUserId: findGroupsByUserIdMock,
  createGroup: createGroupMock,
  findGroupInfo: findGroupInfoMock,
  findGroupCreator: findGroupCreatorMock,
  findGroupMembers: findGroupMembersMock,
  updateGroupName: updateGroupNameMock,
  deleteGroup: deleteGroupMock,
}));
jest.unstable_mockModule("../../shared/checkUserGroup.js", () => ({
  checkGroupUserAccess: checkGroupUserAccessMock,
}));

// Импорт тестируемых модулей после подмены импортов на моки
let groupsService: any;
beforeAll(async () => {
  const service = await import("./groups.service.js");
  groupsService = new service.GroupsService(groupsRepository);
});

describe("groups service", () => {
  const userID = "00000000-0000-0000-0000-000000000001" as UUID;
  const groupID = "00000000-0000-0000-0000-000000000002" as UUID;

  describe("updateGroupName", () => {
    const newName = "Новое название группы";

    beforeEach(() => {
      jest.resetAllMocks();
    });

    test("updates group name when user is creator", async () => {
      findGroupInfoMock.mockResolvedValue({ title: "Family", creatorID: userID });

      await groupsService.updateGroupName(userID, groupID, newName);

      expect(findGroupInfoMock).toHaveBeenCalledWith(groupID);
      expect(updateGroupNameMock).toHaveBeenCalledWith(groupID, newName);
      expect(updateGroupNameMock).toHaveBeenCalledTimes(1);
    });

    test("throw when user is not creator", async () => {
      findGroupInfoMock.mockResolvedValue({ title: "Family", creatorID: groupID });

      await expect(
        groupsService.updateGroupName(userID, groupID, newName),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(findGroupInfoMock).toHaveBeenCalledWith(groupID);
      expect(updateGroupNameMock).not.toHaveBeenCalled();
    });

    test("propagates group lookup error without updating group", async () => {
      const error = new Error("Database unavailable");
      findGroupInfoMock.mockRejectedValue(error);

      await expect(
        groupsService.updateGroupName(userID, groupID, newName),
      ).rejects.toBe(error);

      expect(updateGroupNameMock).not.toHaveBeenCalled();
    });

    test("propagates group update error", async () => {
      findGroupInfoMock.mockResolvedValue({ title: "Family", creatorID: userID });
      const error = new Error("Failed to update group");
      updateGroupNameMock.mockRejectedValue(error);

      await expect(
        groupsService.updateGroupName(userID, groupID, newName),
      ).rejects.toBe(error);

      expect(updateGroupNameMock).toHaveBeenCalledWith(groupID, newName);
    });
  });

  describe("deleteGroup", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test("deletes group when user is creator", async () => {
      findGroupInfoMock.mockResolvedValue({ title: "Family", creatorID: userID });

      await groupsService.deleteGroup(userID, groupID);

      expect(findGroupInfoMock).toHaveBeenCalledWith(groupID);
      expect(deleteGroupMock).toHaveBeenCalledWith(groupID);
      expect(deleteGroupMock).toHaveBeenCalledTimes(1);
    });

    test("throw when user is not creator", async () => {
      findGroupInfoMock.mockResolvedValue({ title: "Family", creatorID: groupID });

      await expect(
        groupsService.deleteGroup(userID, groupID),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(findGroupInfoMock).toHaveBeenCalledWith(groupID);
      expect(deleteGroupMock).not.toHaveBeenCalled();
    });

    test("propagates group lookup error without deleting group", async () => {
      const error = new Error("Database unavailable");
      findGroupInfoMock.mockRejectedValue(error);

      await expect(
        groupsService.deleteGroup(userID, groupID),
      ).rejects.toBe(error);

      expect(deleteGroupMock).not.toHaveBeenCalled();
    });

    test("propagates group delete error", async () => {
      findGroupInfoMock.mockResolvedValue({ title: "Family", creatorID: userID });
      const error = new Error("Failed to delete group");
      deleteGroupMock.mockRejectedValue(error);

      await expect(
        groupsService.deleteGroup(userID, groupID),
      ).rejects.toBe(error);

      expect(deleteGroupMock).toHaveBeenCalledWith(groupID);
    });
  });

  describe("getGroupsByUserId", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test("returns user's groups", async () => {
      const groups = [{ id: groupID, name: "Family" }];
      findGroupsByUserIdMock.mockResolvedValue(groups);

      await expect(groupsService.getGroupsByUserId(userID)).resolves.toEqual(
        groups,
      );

      expect(findGroupsByUserIdMock).toHaveBeenCalledWith(userID);
    });
  });

  describe("addGroup", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test("creates a group for the user", async () => {
      await expect(
        groupsService.addGroup(userID, { groupName: "Family" }),
      ).resolves.toBeUndefined();

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

      await expect(
        groupsService.getGroupInfo(userID, groupID),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(userID, groupID);
      expect(findGroupInfoMock).not.toHaveBeenCalled();
      expect(findGroupCreatorMock).not.toHaveBeenCalled();
      expect(findGroupMembersMock).not.toHaveBeenCalled();
    });

    test("reports creator status: true", async () => {
      checkGroupUserAccessMock.mockResolvedValue(true);
      findGroupInfoMock.mockResolvedValue({
        title: "Family",
        creatorID: userID,
      });

      await expect(
        groupsService.getGroupInfo(userID, groupID),
      ).resolves.toEqual({
        title: "Family",
        isCreator: true,
      });

      expect(findGroupInfoMock).toHaveBeenCalledWith(groupID);
    });

    test("reports creator status: false", async () => {
      checkGroupUserAccessMock.mockResolvedValue(true);
      findGroupInfoMock.mockResolvedValue({
        title: "Family",
        creatorID: groupID,
      });

      await expect(
        groupsService.getGroupInfo(userID, groupID),
      ).resolves.toEqual({
        title: "Family",
        isCreator: false,
      });

      expect(findGroupInfoMock).toHaveBeenCalledWith(groupID);
    });
  });

  describe("getGroupUsers", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test("getGroupUsers denies access before reading group data", async () => {
      checkGroupUserAccessMock.mockResolvedValue(false);

      await expect(
        groupsService.getGroupUsers(userID, groupID),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(userID, groupID);
      expect(findGroupInfoMock).not.toHaveBeenCalled();
      expect(findGroupCreatorMock).not.toHaveBeenCalled();
      expect(findGroupMembersMock).not.toHaveBeenCalled();
    });

    test("rejects a group without a creator", async () => {
      checkGroupUserAccessMock.mockResolvedValue(true);
      findGroupCreatorMock.mockResolvedValue(undefined);

      await expect(
        groupsService.getGroupUsers(userID, groupID),
      ).rejects.toBeInstanceOf(NotFoundError);

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
      await expect(
        groupsService.getGroupUsers(userID, groupID),
      ).resolves.toEqual({
        creator,
        members: [{ name: "Member", hash: 0 }],
      });

      expect(findGroupCreatorMock).toHaveBeenCalledWith(groupID);
      expect(findGroupMembersMock).toHaveBeenCalledWith(groupID);
    });
  });
});
