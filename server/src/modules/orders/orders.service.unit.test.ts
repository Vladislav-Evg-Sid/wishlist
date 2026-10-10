import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import type { CardDataRaw } from "./orders.repository.dto.js";
import type { CardDataInsert } from "./orders.types.js";
import type { UUID } from "../../types/shared.js";
import type { OrdersRepositoryInterface } from "./orders.di.js";

// Мокаем функции
type CheckUserGroup = typeof import("./../../shared/checkUserGroup.js");
const checkGroupUserAccessMock =
  jest.fn<CheckUserGroup["checkGroupUserAccess"]>();
const findGroupIDByWishlistIDMock =
  jest.fn<(wishlistID: UUID) => Promise<UUID | null>>();
const findWishlistCardsMock =
  jest.fn<(wishlistID: UUID) => Promise<CardDataRaw[]>>();
const createCardMock = jest.fn<(card: CardDataInsert) => Promise<number>>();
class OrderRepository implements OrdersRepositoryInterface {
  constructor(
    public readonly findGroupIDByWishlistID: any,
    public readonly findWishlistCards: any,
    public readonly createCard: any,
  ) {}
}
const orderRepository = new OrderRepository(
  findGroupIDByWishlistIDMock,
  findWishlistCardsMock,
  createCardMock,
);

// Мокаем импорты этих функций
jest.unstable_mockModule("../../shared/checkUserGroup.js", () => ({
  checkGroupUserAccess: checkGroupUserAccessMock,
}));

// Импорт тестируемых модулей после подмены импортов на моки
let orderService: any;
beforeAll(async () => {
  const service = await import("./orders.service.js");
  orderService = new service.OrdersService(orderRepository);
});

describe("orders service", () => {
  const userID: UUID = "00000000-0000-0000-0000-000000000000" as UUID;
  const wishlistID: UUID = "00000000-0000-0000-0000-000000000001" as UUID;
  const cardID = 1;
  const groupID: UUID = "00000000-0000-0000-0000-000000000003" as UUID;
  describe("getWishlistCards", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test("throw when wishlist's group does not exist", async () => {
      findGroupIDByWishlistIDMock.mockResolvedValue(null);

      await expect(
        orderService.getWishlistCards(userID, wishlistID),
      ).rejects.toThrow("Not found wishlist's group");

      expect(findGroupIDByWishlistIDMock).toHaveBeenCalledWith(wishlistID);
      expect(checkGroupUserAccessMock).not.toHaveBeenCalled();
      expect(findWishlistCardsMock).not.toHaveBeenCalled();
    });

    test("throw with user not a member or creator", async () => {
      findGroupIDByWishlistIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(false);

      await expect(
        orderService.getWishlistCards(userID, wishlistID),
      ).rejects.toThrow("User not a member or creator");

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(userID, groupID);
      expect(findWishlistCardsMock).not.toHaveBeenCalled();
    });

    const rawCard: CardDataRaw = {
      id: cardID,
      title: "Наушники",
      description: "Хорошие наушники",
      icon: "headphones",
      created_at: new Date("2026-10-01T00:00:00Z"),
      status: "Свободно",
      author_id: userID,
      author_name: "Vlad",
      author_email: "vlad@example.com",
      author_hash: 123,
      reserved_by: null,
      href: null,
    };

    test("returns mapped wishlist cards", async () => {
      findGroupIDByWishlistIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findWishlistCardsMock.mockResolvedValue([rawCard]);

      const result = await orderService.getWishlistCards(userID, wishlistID);

      expect(result).toEqual([
        {
          id: cardID,
          title: "Наушники",
          description: "Хорошие наушники",
          icon: "headphones",
          createdAt: new Date("2026-10-01T00:00:00Z"),
          status: "Свободно",
          author: {
            id: userID,
            name: "Vlad",
            email: "vlad@example.com",
            hash: 123,
          },
          reservedBy: null,
          href: "",
        },
      ]);
      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(userID, groupID);
      expect(findWishlistCardsMock).toHaveBeenCalledWith(wishlistID);
    });
  });

  describe("addCard", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    const newCard: CardDataInsert = {
      title: "Книга",
      description: "Какая-нибудь книга",
      wishlistID: wishlistID,
      icon: "book",
      href: "https://example.com",
      creatorID: userID,
    };

    test("throw when wishlist's group does not exist", async () => {
      findGroupIDByWishlistIDMock.mockResolvedValue(null);

      await expect(orderService.addCard(newCard)).rejects.toThrow(
        "Not found wishlist's group",
      );

      expect(findGroupIDByWishlistIDMock).toHaveBeenCalledWith(wishlistID);
      expect(checkGroupUserAccessMock).not.toHaveBeenCalled();
      expect(createCardMock).not.toHaveBeenCalled();
    });

    test("throw when user not a member or creator", async () => {
      findGroupIDByWishlistIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(false);

      await expect(orderService.addCard(newCard)).rejects.toThrow(
        "User not a member or creator",
      );

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(userID, groupID);
      expect(createCardMock).not.toHaveBeenCalled();
    });

    test("creates card when user has access", async () => {
      findGroupIDByWishlistIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      createCardMock.mockResolvedValue(cardID);

      await orderService.addCard(newCard);

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(userID, groupID);
      expect(createCardMock).toHaveBeenCalledWith(newCard);
      expect(createCardMock).toHaveBeenCalledTimes(1);
    });
  });
});
