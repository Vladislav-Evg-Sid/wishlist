import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import type { CardDataRaw } from "./orders.repository.dto.js";
import type { CardDataInsert, CardDataUpdate } from "./orders.types.js";
import type { UUID } from "../../types/shared.js";
import type { OrdersRepositoryInterface } from "./orders.di.js";
import { ForbidenError, NotFoundError } from "../../shared/errors.js";

// Мокаем функции
type CheckUserGroup = typeof import("./../../shared/checkUserGroup.js");
const checkGroupUserAccessMock =
  jest.fn<CheckUserGroup["checkGroupUserAccess"]>();
const findGroupIDByWishlistIDMock =
  jest.fn<(wishlistID: UUID) => Promise<UUID | null>>();
const findGroupIDByOrderIDMock =
  jest.fn<(orderID: number) => Promise<UUID | null>>();
const findWishlistCardsMock =
  jest.fn<(wishlistID: UUID) => Promise<CardDataRaw[]>>();
const findCardByIDMock =
  jest.fn<(orderID: number) => Promise<CardDataRaw | null>>();
const createCardMock = jest.fn<(card: CardDataInsert) => Promise<number>>();
const updateCardMock = jest.fn<(card: CardDataUpdate) => Promise<void>>();
class OrderRepository implements OrdersRepositoryInterface {
  constructor(
    public readonly findGroupIDByWishlistID: (
      wishlistID: UUID,
    ) => Promise<UUID | null>,
    public readonly findGroupIDByOrderID: (
      orderID: number,
    ) => Promise<UUID | null>,
    public readonly findWishlistCards: (
      wishlistID: UUID,
    ) => Promise<CardDataRaw[]>,
    public readonly findCardByID: (
      orderID: number,
    ) => Promise<CardDataRaw | null>,
    public readonly createCard: (card: CardDataInsert) => Promise<number>,
    public readonly updateCard: (card: CardDataUpdate) => Promise<void>,
  ) {}
}
const orderRepository = new OrderRepository(
  findGroupIDByWishlistIDMock,
  findGroupIDByOrderIDMock,
  findWishlistCardsMock,
  findCardByIDMock,
  createCardMock,
  updateCardMock,
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
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const userID: UUID = "00000000-0000-0000-0000-000000000000" as UUID;
  const wishlistID: UUID = "00000000-0000-0000-0000-000000000001" as UUID;
  const cardID = 1;
  const groupID: UUID = "00000000-0000-0000-0000-000000000003" as UUID;
  describe("getWishlistCards", () => {
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

  describe("updateCard", () => {
    const updatedCardData = {
      id: 1,
      title: "Обновлённое название",
      description: "Новое описание",
      icon: "Другая иконка",
      href: "https://example.com/some-shop/some-order",
    };

    test("throw when order's group does not exist", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(null);

      await expect(
        orderService.updateCard(userID, updatedCardData),
      ).rejects.toBeInstanceOf(NotFoundError);

      expect(findGroupIDByOrderIDMock).toHaveBeenCalledWith(updatedCardData.id);
      expect(checkGroupUserAccessMock).not.toHaveBeenCalled();
      expect(findCardByIDMock).not.toHaveBeenCalled();
      expect(updateCardMock).not.toHaveBeenCalled();
    });

    test("throw when user not a member or creator", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(false);

      await expect(
        orderService.updateCard(userID, updatedCardData),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(userID, groupID);
      expect(findCardByIDMock).not.toHaveBeenCalled();
      expect(updateCardMock).not.toHaveBeenCalled();
    });

    test("throw when card not exist", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findCardByIDMock.mockResolvedValue(null);

      await expect(
        orderService.updateCard(userID, updatedCardData),
      ).rejects.toBeInstanceOf(NotFoundError);

      expect(findCardByIDMock).toHaveBeenCalledWith(updatedCardData.id);
      expect(updateCardMock).not.toHaveBeenCalled();
    });

    test("throw user is not a creator of card", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findCardByIDMock.mockResolvedValue({
        author_id: wishlistID,
      } as CardDataRaw);

      await expect(
        orderService.updateCard(userID, updatedCardData),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(findCardByIDMock).toHaveBeenCalledWith(updatedCardData.id);
      expect(updateCardMock).not.toHaveBeenCalled();
    });

    test("correct update card", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findCardByIDMock.mockResolvedValue({
        author_id: userID,
      } as CardDataRaw);

      await orderService.updateCard(userID, updatedCardData);

      expect(updateCardMock).toHaveBeenCalledWith(updatedCardData);
    });
  });
});
