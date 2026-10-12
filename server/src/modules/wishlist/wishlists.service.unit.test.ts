import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import type { UUID } from "../../types/shared.js";
import type { WishlistsRepositoryInterface } from "./wishlists.di.js";
import type { CreateWishlistData, WishlistData } from "./wishlists.types.js";

// Мокаем функции
type CheckUserGroup = typeof import("../../shared/checkUserGroup.js");
const checkGroupUserAccessMock =
  jest.fn<CheckUserGroup["checkGroupUserAccess"]>();

const createWishlistMock =
  jest.fn<(wishlist: CreateWishlistData) => Promise<string>>();
const findGroupWishlistsMock =
  jest.fn<(groupID: UUID) => Promise<WishlistData[]>>();
class WishlistsRepository implements WishlistsRepositoryInterface {
  constructor(
    public readonly createWishlist: any,
    public readonly findGroupWishlists: any,
  ) {}
}
const wishlistsRepository = new WishlistsRepository(
  createWishlistMock,
  findGroupWishlistsMock,
);

// Мокаем импорты этих функций
jest.unstable_mockModule("../../shared/checkUserGroup.js", () => ({
  checkGroupUserAccess: checkGroupUserAccessMock,
}));

// Импорт тестируемых модулей после подмены импортов на моки
let wishlistsService: any;
beforeAll(async () => {
  const service = await import("./wishlists.service.js");
  wishlistsService = new service.WishlistsService(wishlistsRepository);
});

describe("wishlists service", () => {
  const creatorID = "00000000-0000-0000-0000-000000000001" as UUID;
  const groupID = "00000000-0000-0000-0000-000000000002" as UUID;
  const wishlist = { creatorID, groupID, name: "Birthday" };

  describe("getGroupWishlists", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test("denies reading wishlists without group access", async () => {
      checkGroupUserAccessMock.mockResolvedValue(false);

      await expect(
        wishlistsService.getGroupWishlists(creatorID, groupID),
      ).rejects.toThrow("User not a member or creator");

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(creatorID, groupID);
      expect(findGroupWishlistsMock).not.toHaveBeenCalled();
    });

    test("returns empty group wishlists", async () => {
      checkGroupUserAccessMock.mockResolvedValue(true);
      findGroupWishlistsMock.mockResolvedValue([]);

      await expect(
        wishlistsService.getGroupWishlists(creatorID, groupID),
      ).resolves.toEqual([]);

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(creatorID, groupID);
      expect(findGroupWishlistsMock).toHaveBeenCalledWith(groupID);
    });

    test("returns group wishlists", async () => {
      checkGroupUserAccessMock.mockResolvedValue(true);
      findGroupWishlistsMock.mockResolvedValue([
        { id: groupID, title: "Birthday" },
      ]);

      await expect(
        wishlistsService.getGroupWishlists(creatorID, groupID),
      ).resolves.toEqual([{ id: groupID, title: "Birthday" }]);

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(creatorID, groupID);
      expect(findGroupWishlistsMock).toHaveBeenCalledWith(groupID);
    });
  });

  describe("addWishlist", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test("denies creating a wishlist without group access", async () => {
      checkGroupUserAccessMock.mockResolvedValue(false);

      await expect(wishlistsService.addWishlist(wishlist)).rejects.toThrow(
        "User not a member or creator",
      );

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(creatorID, groupID);
      expect(createWishlistMock).not.toHaveBeenCalled();
    });

    test("creates a wishlist with group access", async () => {
      checkGroupUserAccessMock.mockResolvedValue(true);

      await expect(
        wishlistsService.addWishlist(wishlist),
      ).resolves.toBeUndefined();

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(creatorID, groupID);
      expect(createWishlistMock).toHaveBeenCalledTimes(1);
      expect(createWishlistMock).toHaveBeenCalledWith(wishlist);
    });
  });
});
