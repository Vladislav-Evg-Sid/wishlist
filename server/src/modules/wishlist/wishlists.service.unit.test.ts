import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import type { UUID } from "../../types/shared.js";

type Repository = typeof import("./wishlists.repository.js");

// Мокаем функции
const createWishlistMock = jest.fn<Repository["createWishlist"]>();
const findGroupWishlistsMock = jest.fn<Repository["findGroupWishlists"]>();
type CheckUserGroup = typeof import("../../shared/checkUserGroup.js");

const checkGroupUserAccessMock =
  jest.fn<CheckUserGroup["checkGroupUserAccess"]>();

// Мокаем импорты этих функций
jest.unstable_mockModule("./wishlists.repository.js", () => ({
  createWishlist: createWishlistMock,
  findGroupWishlists: findGroupWishlistsMock,
}));
jest.unstable_mockModule("../../shared/checkUserGroup.js", () => ({
  checkGroupUserAccess: checkGroupUserAccessMock,
}));

// Импорт тестируемых модулей после подмены импортов на моки
type WishlistsService = typeof import("./wishlists.service.js");

let getGroupWishlists: WishlistsService["getGroupWishlists"];
let addWishlist: WishlistsService["addWishlist"];
beforeAll(async () => {
  const service = await import("./wishlists.service.js");

  getGroupWishlists = service.getGroupWishlists;
  addWishlist = service.addWishlist;
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

      await expect(getGroupWishlists(creatorID, groupID)).rejects.toThrow(
        "User not a member or creator",
      );

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(creatorID, groupID);
      expect(findGroupWishlistsMock).not.toHaveBeenCalled();
    });

    test("returns empty group wishlists", async () => {
      checkGroupUserAccessMock.mockResolvedValue(true);
      findGroupWishlistsMock.mockResolvedValue([]);

      await expect(getGroupWishlists(creatorID, groupID)).resolves.toEqual([]);

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(creatorID, groupID);
      expect(findGroupWishlistsMock).toHaveBeenCalledWith(groupID);
    });

    test("returns group wishlists", async () => {
      checkGroupUserAccessMock.mockResolvedValue(true);
      findGroupWishlistsMock.mockResolvedValue([{ id: groupID, title: "Birthday" }]);

      await expect(getGroupWishlists(creatorID, groupID)).resolves.toEqual(
        [{ id: groupID, title: "Birthday" }],
      );

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

      await expect(addWishlist(wishlist)).rejects.toThrow("User not a member or creator");

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(creatorID, groupID);
      expect(createWishlistMock).not.toHaveBeenCalled();
    });

    test("creates a wishlist with group access", async () => {
      checkGroupUserAccessMock.mockResolvedValue(true);

      await expect(addWishlist(wishlist)).resolves.toBeUndefined();

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(creatorID, groupID);
      expect(createWishlistMock).toHaveBeenCalledWith(wishlist);
      expect(createWishlistMock).toHaveBeenCalledTimes(1);
    });
  });
});
