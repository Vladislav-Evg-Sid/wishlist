import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import type { UUID } from "../../types/shared.js";
import type {
  WishlistsRepositoryInterface,
  WishlistsServiceInterface,
} from "./wishlists.di.js";
import type { CreateWishlistData, WishlistData } from "./wishlists.types.js";
import { ForbidenError, NotFoundError } from "../../shared/errors.js";
import type { WishlistInfoRaw } from "./wishlists.repository.dto.js";

// Мокаем функции
type CheckUserGroup = typeof import("../../shared/checkUserGroup.js");
const checkGroupUserAccessMock =
  jest.fn<CheckUserGroup["checkGroupUserAccess"]>();

const findGroupWishlistsMock =
  jest.fn<(groupID: UUID) => Promise<WishlistData[]>>();
const createWishlistMock =
  jest.fn<(wishlist: CreateWishlistData) => Promise<string>>();
const findWishlistInfoMock =
  jest.fn<(wishlistID: UUID) => Promise<WishlistInfoRaw>>();
const deleteWishlistMock = jest.fn<(wishlistID: UUID) => Promise<void>>();
const updateWishlistNameMock =
  jest.fn<(wishlistID: UUID, newName: string) => Promise<void>>();
const findGroupIDByWishlistIDMock =
  jest.fn<(wishlistID: UUID) => Promise<UUID | null>>();
class WishlistsRepository implements WishlistsRepositoryInterface {
  constructor(
    public readonly findGroupWishlists: (
      groupID: UUID,
    ) => Promise<WishlistData[]>,
    public readonly createWishlist: (
      wishlist: CreateWishlistData,
    ) => Promise<string>,
    public readonly findWishlistInfo: (
      wishlistID: UUID,
    ) => Promise<WishlistInfoRaw>,
    public readonly deleteWishlist: (wishlistID: UUID) => Promise<void>,
    public readonly updateWishlistName: (
      wishlistID: UUID,
      newName: string,
    ) => Promise<void>,
    public readonly findGroupIDByWishlistID: (
      wishlistID: UUID,
    ) => Promise<UUID | null>,
  ) {}
}
const wishlistsRepository = new WishlistsRepository(
  findGroupWishlistsMock,
  createWishlistMock,
  findWishlistInfoMock,
  deleteWishlistMock,
  updateWishlistNameMock,
  findGroupIDByWishlistIDMock,
);

// Мокаем импорты этих функций
jest.unstable_mockModule("../../shared/checkUserGroup.js", () => ({
  checkGroupUserAccess: checkGroupUserAccessMock,
}));

// Импорт тестируемых модулей после подмены импортов на моки
let wishlistsService: WishlistsServiceInterface;
beforeAll(async () => {
  const service = await import("./wishlists.service.js");
  wishlistsService = new service.WishlistsService(wishlistsRepository);
});

describe("wishlists service", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const userID = "00000000-0000-0000-0000-000000000001" as UUID;
  const groupID = "00000000-0000-0000-0000-000000000002" as UUID;
  const wishlistID = "00000000-0000-0000-0000-000000000003" as UUID;
  const exampleUUID = "00000000-0000-0000-0000-000000000004" as UUID;
  const wishlist = { creatorID: userID, groupID, name: "Birthday" };

  describe("getGroupWishlists", () => {
    test("denies reading wishlists without group access", async () => {
      checkGroupUserAccessMock.mockResolvedValue(false);

      await expect(
        wishlistsService.getGroupWishlists(userID, groupID),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(userID, groupID);
      expect(findGroupWishlistsMock).not.toHaveBeenCalled();
    });

    test("returns empty group wishlists", async () => {
      checkGroupUserAccessMock.mockResolvedValue(true);
      findGroupWishlistsMock.mockResolvedValue([]);

      await expect(
        wishlistsService.getGroupWishlists(userID, groupID),
      ).resolves.toEqual([]);

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(userID, groupID);
      expect(findGroupWishlistsMock).toHaveBeenCalledWith(groupID);
    });

    test("returns group wishlists", async () => {
      checkGroupUserAccessMock.mockResolvedValue(true);
      findGroupWishlistsMock.mockResolvedValue([
        { id: groupID, title: "Birthday" },
      ]);

      await expect(
        wishlistsService.getGroupWishlists(userID, groupID),
      ).resolves.toEqual([{ id: groupID, title: "Birthday" }]);

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(userID, groupID);
      expect(findGroupWishlistsMock).toHaveBeenCalledWith(groupID);
    });
  });

  describe("addWishlist", () => {
    test("denies creating a wishlist without group access", async () => {
      checkGroupUserAccessMock.mockResolvedValue(false);

      await expect(
        wishlistsService.addWishlist(wishlist),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(userID, groupID);
      expect(createWishlistMock).not.toHaveBeenCalled();
    });

    test("creates a wishlist with group access", async () => {
      checkGroupUserAccessMock.mockResolvedValue(true);

      await expect(
        wishlistsService.addWishlist(wishlist),
      ).resolves.toBeUndefined();

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(userID, groupID);
      expect(createWishlistMock).toHaveBeenCalledTimes(1);
      expect(createWishlistMock).toHaveBeenCalledWith(wishlist);
    });
  });

  describe("getWishlistInfo", () => {
    test("throw with unknown group", async () => {
      findGroupIDByWishlistIDMock.mockResolvedValue(null);

      await expect(
        wishlistsService.getWishlistInfo(userID, wishlistID),
      ).rejects.toBeInstanceOf(NotFoundError);

      expect(findGroupIDByWishlistIDMock).toHaveBeenCalledWith(wishlistID);
      expect(checkGroupUserAccessMock).not.toHaveBeenCalled();
      expect(findWishlistInfoMock).not.toHaveBeenCalled();
    });

    test("throw with user not a member or creator", async () => {
      findGroupIDByWishlistIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(false);

      await expect(
        wishlistsService.getWishlistInfo(userID, wishlistID),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(userID, groupID);
      expect(findWishlistInfoMock).not.toHaveBeenCalled();
    });

    test("sucess founding, user not a creator", async () => {
      findGroupIDByWishlistIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findWishlistInfoMock.mockResolvedValue({
        title: "someTitle",
        creatorID: exampleUUID,
      });

      const returnedValue = await wishlistsService.getWishlistInfo(
        userID,
        wishlistID,
      );

      expect(findWishlistInfoMock).toHaveBeenCalledWith(wishlistID);
      expect(returnedValue).toStrictEqual({
        title: "someTitle",
        isCreator: false,
      });
    });

    test("sucess founding, user a creator", async () => {
      findGroupIDByWishlistIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findWishlistInfoMock.mockResolvedValue({
        title: "someTitle",
        creatorID: userID,
      });

      const returnedValue = await wishlistsService.getWishlistInfo(
        userID,
        wishlistID,
      );

      expect(findWishlistInfoMock).toHaveBeenCalledWith(wishlistID);
      expect(returnedValue).toStrictEqual({
        title: "someTitle",
        isCreator: true,
      });
    });
  });

  describe("deleteWishlist", () => {
    test("throw with unknown group", async () => {
      findGroupIDByWishlistIDMock.mockResolvedValue(null);

      await expect(
        wishlistsService.deleteWishlist(userID, wishlistID),
      ).rejects.toBeInstanceOf(NotFoundError);

      expect(findGroupIDByWishlistIDMock).toHaveBeenCalledWith(wishlistID);
      expect(checkGroupUserAccessMock).not.toHaveBeenCalled();
      expect(findWishlistInfoMock).not.toHaveBeenCalled();
      expect(deleteWishlistMock).not.toHaveBeenCalled();
    });

    test("throw with user not a member or creator", async () => {
      findGroupIDByWishlistIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(false);

      await expect(
        wishlistsService.deleteWishlist(userID, wishlistID),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(userID, groupID);
      expect(findWishlistInfoMock).not.toHaveBeenCalled();
      expect(deleteWishlistMock).not.toHaveBeenCalled();
    });

    test("throw with user not a wishlist creator", async () => {
      findGroupIDByWishlistIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findWishlistInfoMock.mockResolvedValue({
        title: "",
        creatorID: exampleUUID,
      });

      await expect(
        wishlistsService.deleteWishlist(userID, wishlistID),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(findWishlistInfoMock).toHaveBeenCalledWith(wishlistID);
      expect(deleteWishlistMock).not.toHaveBeenCalled();
    });

    test("sucess deleting", async () => {
      findGroupIDByWishlistIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findWishlistInfoMock.mockResolvedValue({ title: "", creatorID: userID });

      await expect(
        wishlistsService.deleteWishlist(userID, wishlistID),
      ).resolves.toBeUndefined();

      expect(deleteWishlistMock).toHaveBeenCalledWith(wishlistID);
    });
  });

  describe("updateWishlistName", () => {
    test("throw with unknown group", async () => {
      findGroupIDByWishlistIDMock.mockResolvedValue(null);

      await expect(
        wishlistsService.updateWishlistName(userID, wishlistID, ""),
      ).rejects.toBeInstanceOf(NotFoundError);

      expect(findGroupIDByWishlistIDMock).toHaveBeenCalledWith(wishlistID);
      expect(checkGroupUserAccessMock).not.toHaveBeenCalled();
      expect(findWishlistInfoMock).not.toHaveBeenCalled();
      expect(updateWishlistNameMock).not.toHaveBeenCalled();
    });

    test("throw with user not a member or creator", async () => {
      findGroupIDByWishlistIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(false);

      await expect(
        wishlistsService.updateWishlistName(userID, wishlistID, ""),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(userID, groupID);
      expect(findWishlistInfoMock).not.toHaveBeenCalled();
      expect(updateWishlistNameMock).not.toHaveBeenCalled();
    });

    test("throw with user not a wishlist creator", async () => {
      findGroupIDByWishlistIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findWishlistInfoMock.mockResolvedValue({
        title: "",
        creatorID: exampleUUID,
      });

      await expect(
        wishlistsService.updateWishlistName(userID, wishlistID, ""),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(findWishlistInfoMock).toHaveBeenCalledWith(wishlistID);
      expect(updateWishlistNameMock).not.toHaveBeenCalled();
    });

    test("sucess updating", async () => {
      findGroupIDByWishlistIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findWishlistInfoMock.mockResolvedValue({
        title: "",
        creatorID: userID,
      });

      await expect(
        wishlistsService.updateWishlistName(
          userID,
          wishlistID,
          "new wishlist title",
        ),
      ).resolves.toBeUndefined();

      expect(updateWishlistNameMock).toHaveBeenCalledWith(
        wishlistID,
        "new wishlist title",
      );
    });
  });
});
