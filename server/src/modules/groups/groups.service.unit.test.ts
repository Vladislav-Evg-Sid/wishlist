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
import type { GroupData, UserData } from "./groups.types.js";
import type { GroupInfoRaw } from "./groups.repository.dto.js";
import {
  DataConflictError,
  ForbidenError,
  InternalServerError,
  NotFoundError,
} from "../../shared/errors.js";
import type { redisServiceInviteInterface } from "../../infrastructure/redis/redis.di.js";

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
  jest.fn<(groupID: UUID) => Promise<UserData | undefined>>();
const findGroupMembersMock = jest.fn<(groupID: UUID) => Promise<UserData[]>>();
const updateGroupNameMock =
  jest.fn<GroupsRepositoryInterface["updateGroupName"]>();
const deleteGroupMock = jest.fn<GroupsRepositoryInterface["deleteGroup"]>();
const addGroupMemberMock =
  jest.fn<(groupID: UUID, memberID: UUID) => Promise<void>>();
class GroupsRepository implements GroupsRepositoryInterface {
  constructor(
    public readonly findGroupsByUserId: any,
    public readonly createGroup: any,
    public readonly findGroupInfo: any,
    public readonly findGroupCreator: any,
    public readonly findGroupMembers: any,
    public readonly updateGroupName: GroupsRepositoryInterface["updateGroupName"],
    public readonly deleteGroup: GroupsRepositoryInterface["deleteGroup"],
    public readonly addGroupMember: GroupsRepositoryInterface["addGroupMember"],
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
  addGroupMemberMock,
);
const setHashCounterValueMock =
  jest.fn<
    (
      prefix: string,
      key: string,
      payloadName: string,
      payloadValue: any,
      counterName: string,
      counterValue: number,
      ttl?: number,
    ) => Promise<boolean>
  >();
const getHashValueMock =
  jest.fn<
    (
      prefix: string,
      key: string,
      counterName: string,
      payloadName: string,
    ) => Promise<any>
  >();
const decrementHashCounterMock =
  jest.fn<
    (prefix: string, key: string, counterName: string) => Promise<void>
  >();
class RedisService implements redisServiceInviteInterface {
  constructor(
    readonly setHashCounterValue: (
      prefix: string,
      key: string,
      payloadName: string,
      payloadValue: any,
      counterName: string,
      counterValue: number,
      ttl?: number,
    ) => Promise<boolean>,
    readonly getHashValue: (
      prefix: string,
      key: string,
      counterName: string,
      payloadName: string,
    ) => Promise<any>,
    readonly decrementHashCounter: (
      prefix: string,
      key: string,
      counterName: string,
    ) => Promise<void>,
  ) {}
}
const redisService = new RedisService(
  setHashCounterValueMock,
  getHashValueMock,
  decrementHashCounterMock,
);

// Мокаем импорты этих функций
jest.unstable_mockModule("../../shared/checkUserGroup.js", () => ({
  checkGroupUserAccess: checkGroupUserAccessMock,
}));

// Импорт тестируемых модулей после подмены импортов на моки
let groupsService: any;
beforeAll(async () => {
  const service = await import("./groups.service.js");
  groupsService = new service.GroupsService(groupsRepository, redisService);
});

describe("groups service", () => {
  const userID = "00000000-0000-0000-0000-000000000001" as UUID;
  const groupID = "00000000-0000-0000-0000-000000000002" as UUID;
  const exampleUUID = "00000000-0000-0000-0000-000000000003" as UUID;
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("updateGroupName", () => {
    const newName = "Новое название группы";

    test("updates group name when user is creator", async () => {
      findGroupInfoMock.mockResolvedValue({
        title: "Family",
        creatorID: userID,
      });

      await groupsService.updateGroupName(userID, groupID, newName);

      expect(findGroupInfoMock).toHaveBeenCalledWith(groupID);
      expect(updateGroupNameMock).toHaveBeenCalledWith(groupID, newName);
      expect(updateGroupNameMock).toHaveBeenCalledTimes(1);
    });

    test("throw when user is not creator", async () => {
      findGroupInfoMock.mockResolvedValue({
        title: "Family",
        creatorID: groupID,
      });

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
      findGroupInfoMock.mockResolvedValue({
        title: "Family",
        creatorID: userID,
      });
      const error = new Error("Failed to update group");
      updateGroupNameMock.mockRejectedValue(error);

      await expect(
        groupsService.updateGroupName(userID, groupID, newName),
      ).rejects.toBe(error);

      expect(updateGroupNameMock).toHaveBeenCalledWith(groupID, newName);
    });
  });

  describe("deleteGroup", () => {
    test("deletes group when user is creator", async () => {
      findGroupInfoMock.mockResolvedValue({
        title: "Family",
        creatorID: userID,
      });

      await groupsService.deleteGroup(userID, groupID);

      expect(findGroupInfoMock).toHaveBeenCalledWith(groupID);
      expect(deleteGroupMock).toHaveBeenCalledWith(groupID);
      expect(deleteGroupMock).toHaveBeenCalledTimes(1);
    });

    test("throw when user is not creator", async () => {
      findGroupInfoMock.mockResolvedValue({
        title: "Family",
        creatorID: groupID,
      });

      await expect(
        groupsService.deleteGroup(userID, groupID),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(findGroupInfoMock).toHaveBeenCalledWith(groupID);
      expect(deleteGroupMock).not.toHaveBeenCalled();
    });

    test("propagates group lookup error without deleting group", async () => {
      const error = new Error("Database unavailable");
      findGroupInfoMock.mockRejectedValue(error);

      await expect(groupsService.deleteGroup(userID, groupID)).rejects.toBe(
        error,
      );

      expect(deleteGroupMock).not.toHaveBeenCalled();
    });

    test("propagates group delete error", async () => {
      findGroupInfoMock.mockResolvedValue({
        title: "Family",
        creatorID: userID,
      });
      const error = new Error("Failed to delete group");
      deleteGroupMock.mockRejectedValue(error);

      await expect(groupsService.deleteGroup(userID, groupID)).rejects.toBe(
        error,
      );

      expect(deleteGroupMock).toHaveBeenCalledWith(groupID);
    });
  });

  describe("getGroupsByUserId", () => {
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
    test("creates a group for the user", async () => {
      await expect(
        groupsService.addGroup(userID, { groupName: "Family" }),
      ).resolves.toBeUndefined();

      expect(createGroupMock).toHaveBeenCalledWith(userID, "Family");
      expect(createGroupMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("getGroupInfo", () => {
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
      const creator = { name: "Creator", hash: 1, id: userID };
      findGroupCreatorMock.mockResolvedValue(creator);
      findGroupMembersMock.mockResolvedValue([
        { id: exampleUUID, name: "Member", hash: 0 },
        {
          id: exampleUUID,
          name: null,
          hash: 2,
        } as unknown as UserData,
        { name: "Missing hash", hash: null } as unknown as UserData,
      ]);
      await expect(
        groupsService.getGroupUsers(userID, groupID),
      ).resolves.toEqual({
        creator,
        members: [{ name: "Member", hash: 0, id: exampleUUID }],
      });

      expect(findGroupCreatorMock).toHaveBeenCalledWith(groupID);
      expect(findGroupMembersMock).toHaveBeenCalledWith(groupID);
    });
  });

  describe("createInviteCode", () => {
    const ttl = 1;
    const limitMembers = 2;
    test("error with user not a creator", async () => {
      findGroupInfoMock.mockResolvedValue({
        creatorID: exampleUUID,
      } as GroupInfoRaw);

      await expect(
        groupsService.createInviteCode(userID, groupID, null, null),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(findGroupInfoMock).toHaveBeenCalledWith(groupID);
      expect(setHashCounterValueMock).not.toHaveBeenCalled();
    });

    test("error with ttl and limitMembers are null", async () => {
      findGroupInfoMock.mockResolvedValue({
        creatorID: userID,
      } as GroupInfoRaw);

      await expect(
        groupsService.createInviteCode(userID, groupID, null, null),
      ).rejects.toBeInstanceOf(DataConflictError);

      expect(findGroupInfoMock).toHaveBeenCalledWith(groupID);
      expect(setHashCounterValueMock).not.toHaveBeenCalled();
    });

    test("error with cannot create uniq code", async () => {
      findGroupInfoMock.mockResolvedValue({
        creatorID: userID,
      } as GroupInfoRaw);
      setHashCounterValueMock.mockResolvedValue(false);

      await expect(
        groupsService.createInviteCode(userID, groupID, null, limitMembers),
      ).rejects.toBeInstanceOf(InternalServerError);

      expect(findGroupInfoMock).toHaveBeenCalledWith(groupID);
      expect(setHashCounterValueMock).toHaveBeenCalledTimes(10);
    });

    test("success create invite code without ttl and with limitMembers", async () => {
      findGroupInfoMock.mockResolvedValue({
        creatorID: userID,
      } as GroupInfoRaw);
      setHashCounterValueMock.mockResolvedValue(true);

      const createdCode = await groupsService.createInviteCode(
        userID,
        groupID,
        null,
        limitMembers,
      );

      expect(findGroupInfoMock).toHaveBeenCalledWith(groupID);
      expect(setHashCounterValueMock).toHaveBeenCalledWith(
        "ic",
        createdCode,
        "groupID",
        groupID,
        "remaining",
        limitMembers,
        undefined,
      );
    });

    test("success create invite code with ttl and without limitMembers", async () => {
      findGroupInfoMock.mockResolvedValue({
        creatorID: userID,
      } as GroupInfoRaw);
      setHashCounterValueMock.mockResolvedValue(true);

      const createdCode = await groupsService.createInviteCode(
        userID,
        groupID,
        ttl,
        null,
      );

      expect(findGroupInfoMock).toHaveBeenCalledWith(groupID);
      expect(setHashCounterValueMock).toHaveBeenCalledWith(
        "ic",
        createdCode,
        "groupID",
        groupID,
        "remaining",
        -1,
        ttl * 60 * 60,
      );
    });

    test("success create invite code with ttl and limitMembers", async () => {
      findGroupInfoMock.mockResolvedValue({
        creatorID: userID,
      } as GroupInfoRaw);
      setHashCounterValueMock.mockResolvedValue(true);

      const createdCode = await groupsService.createInviteCode(
        userID,
        groupID,
        ttl,
        limitMembers,
      );

      expect(findGroupInfoMock).toHaveBeenCalledWith(groupID);
      expect(setHashCounterValueMock).toHaveBeenCalledWith(
        "ic",
        createdCode,
        "groupID",
        groupID,
        "remaining",
        limitMembers,
        ttl * 60 * 60,
      );
    });
  });

  describe("addMemberByInviteCode", () => {
    test("error with inknown code", async () => {
      getHashValueMock.mockResolvedValue(0);

      await expect(
        groupsService.addMemberByInviteCode(userID, "AAAAAA"),
      ).rejects.toBeInstanceOf(NotFoundError);

      expect(findGroupCreatorMock).not.toHaveBeenCalled();
      expect(findGroupMembersMock).not.toHaveBeenCalled();
      expect(addGroupMemberMock).not.toHaveBeenCalled();
      expect(decrementHashCounterMock).not.toHaveBeenCalled();
    });

    test("error with group not exist", async () => {
      getHashValueMock.mockResolvedValue(groupID);
      findGroupCreatorMock.mockResolvedValue(undefined);

      await expect(
        groupsService.addMemberByInviteCode(userID, "AAAAAA"),
      ).rejects.toBeInstanceOf(NotFoundError);

      expect(findGroupCreatorMock).toHaveBeenCalledWith(groupID);
      expect(findGroupMembersMock).not.toHaveBeenCalled();
      expect(addGroupMemberMock).not.toHaveBeenCalled();
      expect(decrementHashCounterMock).not.toHaveBeenCalled();
    });

    test("sucess with user is creator", async () => {
      getHashValueMock.mockResolvedValue(groupID);
      findGroupCreatorMock.mockResolvedValue({ id: userID } as UserData);

      const memberGroupID = await groupsService.addMemberByInviteCode(
        userID,
        "AAAAAA",
      );

      expect(findGroupCreatorMock).toHaveBeenCalledWith(groupID);
      expect(findGroupMembersMock).not.toHaveBeenCalled();
      expect(addGroupMemberMock).not.toHaveBeenCalled();
      expect(decrementHashCounterMock).not.toHaveBeenCalled();
      expect(memberGroupID).toBe(groupID);
    });

    test("sucess with user is member", async () => {
      getHashValueMock.mockResolvedValue(groupID);
      findGroupCreatorMock.mockResolvedValue({ id: exampleUUID } as UserData);
      findGroupMembersMock.mockResolvedValue([{ id: userID } as UserData]);

      const memberGroupID = await groupsService.addMemberByInviteCode(
        userID,
        "AAAAAA",
      );

      expect(findGroupCreatorMock).toHaveBeenCalledWith(groupID);
      expect(findGroupMembersMock).toHaveBeenCalledWith(groupID);
      expect(addGroupMemberMock).not.toHaveBeenCalled();
      expect(decrementHashCounterMock).not.toHaveBeenCalled();
      expect(memberGroupID).toBe(groupID);
    });

    test("sucess with user not a member", async () => {
      getHashValueMock.mockResolvedValue(groupID);
      findGroupCreatorMock.mockResolvedValue({ id: exampleUUID } as UserData);
      findGroupMembersMock.mockResolvedValue([
        { id: null } as unknown as UserData,
      ]);

      const memberGroupID = await groupsService.addMemberByInviteCode(
        userID,
        "AAAAAA",
      );

      expect(findGroupCreatorMock).toHaveBeenCalledWith(groupID);
      expect(findGroupMembersMock).toHaveBeenCalledWith(groupID);
      expect(addGroupMemberMock).toHaveBeenCalledWith(groupID, userID);
      expect(memberGroupID).toBe(groupID);
    });
  });
});
