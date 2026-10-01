import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import type { CardDataRaw } from "./orders.dto.js";
import type { CardDataInsert } from "./orders.types.js";

// Мокаем функции
const createCardMock = jest.fn<(card: CardDataInsert) => Promise<string>>();
const findGroupIDByWishlistIDMock =
  jest.fn<(wishlistID: string) => Promise<string | null>>();
const findWishlistCardsMock =
  jest.fn<(wishlistID: string) => Promise<CardDataRaw[]>>();
const checkGroupUserAccessMock =
  jest.fn<(userID: string, groupID: string) => Promise<boolean>>();

// Мокаем импорты этих функций
jest.unstable_mockModule("./orders.repository.js", () => ({
  findGroupIDByWishlistID: findGroupIDByWishlistIDMock,
  findWishlistCards: findWishlistCardsMock,
  createCard: createCardMock,
}));

jest.unstable_mockModule("../../shared/checkUserGroup.js", () => ({
  checkGroupUserAccess: checkGroupUserAccessMock,
}));

// Импорт тестируемых модулей после подмены импортов на моки
type OrdersService = typeof import("./orders.service.js");
let getWishlistCards: OrdersService["getWishlistCards"];
let addCard: OrdersService["addCard"];
beforeAll(async () => {
  const service = await import("./orders.service.js");
  getWishlistCards = service.getWishlistCards;
  addCard = service.addCard;
});

describe("getWishlistCards", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("throw when wishlist's group does not exist", async () => {
    findGroupIDByWishlistIDMock.mockResolvedValue(null);

    await expect(getWishlistCards("user-1", "wishlist-1")).rejects.toThrow(
      "Not found wishlist's group",
    );

    expect(findGroupIDByWishlistIDMock).toHaveBeenCalledWith("wishlist-1");
    expect(checkGroupUserAccessMock).not.toHaveBeenCalled();
    expect(findWishlistCardsMock).not.toHaveBeenCalled();
  });

  test("throw with user not a member or creator", async () => {
    findGroupIDByWishlistIDMock.mockResolvedValue("group-1");
    checkGroupUserAccessMock.mockResolvedValue(false);

    await expect(getWishlistCards("user-1", "wishlist-1")).rejects.toThrow(
      "User not a member or creator",
    );

    expect(checkGroupUserAccessMock).toHaveBeenCalledWith("user-1", "group-1");
    expect(findWishlistCardsMock).not.toHaveBeenCalled();
  });

  const rawCard: CardDataRaw = {
    id: "card-1",
    title: "Наушники",
    description: "Хорошие наушники",
    icon: "headphones",
    created_at: new Date("2026-10-01T00:00:00Z"),
    status: "Свободно",
    author_id: "user-1",
    author_name: "Vlad",
    author_email: "vlad@example.com",
    author_hash: 123,
    reserved_by: null,
    href: null,
  };

  test("returns mapped wishlist cards", async () => {
    findGroupIDByWishlistIDMock.mockResolvedValue("group-1");
    checkGroupUserAccessMock.mockResolvedValue(true);
    findWishlistCardsMock.mockResolvedValue([rawCard]);

    const result = await getWishlistCards("user-1", "wishlist-1");

    expect(result).toEqual([
      {
        id: "card-1",
        title: "Наушники",
        description: "Хорошие наушники",
        icon: "headphones",
        createdAt: new Date("2026-10-01T00:00:00Z"),
        status: "Свободно",
        author: {
          id: "user-1",
          name: "Vlad",
          email: "vlad@example.com",
          hash: 123,
        },
        reservedBy: null,
        href: "",
      },
    ]);
    expect(checkGroupUserAccessMock).toHaveBeenCalledWith("user-1", "group-1");
    expect(findWishlistCardsMock).toHaveBeenCalledWith("wishlist-1");
  });
});

describe("addCard", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const newCard: CardDataInsert = {
    title: "Книга",
    description: "Какая-нибудь книга",
    wishlistID: "wishlist-1",
    icon: "book",
    href: "https://example.com",
    creatorID: "user-1",
  };

  test("throw when wishlist's group does not exist", async () => {
    findGroupIDByWishlistIDMock.mockResolvedValue(null);

    await expect(addCard(newCard)).rejects.toThrow(
      "Not found wishlist's group",
    );

    expect(findGroupIDByWishlistIDMock).toHaveBeenCalledWith("wishlist-1");
    expect(checkGroupUserAccessMock).not.toHaveBeenCalled();
    expect(createCardMock).not.toHaveBeenCalled();
  });

  test("throw when user not a member or creator", async () => {
    findGroupIDByWishlistIDMock.mockResolvedValue("group-1");
    checkGroupUserAccessMock.mockResolvedValue(false);

    await expect(addCard(newCard)).rejects.toThrow(
      "User not a member or creator",
    );

    expect(checkGroupUserAccessMock).toHaveBeenCalledWith("user-1", "group-1");
    expect(createCardMock).not.toHaveBeenCalled();
  });

  test("creates card when user has access", async () => {
    findGroupIDByWishlistIDMock.mockResolvedValue("group-1");
    checkGroupUserAccessMock.mockResolvedValue(true);
    createCardMock.mockResolvedValue("card-1");

    await addCard(newCard);

    expect(checkGroupUserAccessMock).toHaveBeenCalledWith("user-1", "group-1");
    expect(createCardMock).toHaveBeenCalledWith(newCard);
    expect(createCardMock).toHaveBeenCalledTimes(1);
  });
});
