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
import type {
  OrdersRepositoryInterface,
  OrdersServiceInterface,
} from "./orders.di.js";
import {
  DataConflictError,
  ForbidenError,
  NotFoundError,
} from "../../shared/errors.js";

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
const deleteCardMock = jest.fn<(cardID: number) => Promise<void>>();
const reserveCardMock =
  jest.fn<(cardID: number, userID: UUID) => Promise<void>>();
const unReserveCardMock = jest.fn<(cardID: number) => Promise<void>>();
const giveCardMock = jest.fn<(cardID: number) => Promise<void>>();
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
    public readonly deleteCard: (cardID: number) => Promise<void>,
    public readonly reserveCard: (
      cardID: number,
      userID: UUID,
    ) => Promise<void>,
    public readonly unReserveCard: (cardID: number) => Promise<void>,
    public readonly giveCard: (cardID: number) => Promise<void>,
  ) {}
}
const orderRepository = new OrderRepository(
  findGroupIDByWishlistIDMock,
  findGroupIDByOrderIDMock,
  findWishlistCardsMock,
  findCardByIDMock,
  createCardMock,
  updateCardMock,
  deleteCardMock,
  reserveCardMock,
  unReserveCardMock,
  giveCardMock,
);

// Мокаем импорты этих функций
jest.unstable_mockModule("../../shared/checkUserGroup.js", () => ({
  checkGroupUserAccess: checkGroupUserAccessMock,
}));

// Импорт тестируемых модулей после подмены импортов на моки
let orderService: OrdersServiceInterface;
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
  const exampleUUID: UUID = "00000000-0000-0000-0000-000000000004" as UUID;
  describe("getWishlistCards", () => {
    test("throw when wishlist's group does not exist", async () => {
      findGroupIDByWishlistIDMock.mockResolvedValue(null);

      await expect(
        orderService.getWishlistCards(userID, wishlistID),
      ).rejects.toBeInstanceOf(NotFoundError);

      expect(findGroupIDByWishlistIDMock).toHaveBeenCalledWith(wishlistID);
      expect(checkGroupUserAccessMock).not.toHaveBeenCalled();
      expect(findWishlistCardsMock).not.toHaveBeenCalled();
    });

    test("throw with user not a member or creator", async () => {
      findGroupIDByWishlistIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(false);

      await expect(
        orderService.getWishlistCards(userID, wishlistID),
      ).rejects.toBeInstanceOf(ForbidenError);

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

      await expect(orderService.addCard(newCard)).rejects.toBeInstanceOf(
        NotFoundError,
      );

      expect(findGroupIDByWishlistIDMock).toHaveBeenCalledWith(wishlistID);
      expect(checkGroupUserAccessMock).not.toHaveBeenCalled();
      expect(createCardMock).not.toHaveBeenCalled();
    });

    test("throw when user not a member or creator", async () => {
      findGroupIDByWishlistIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(false);

      await expect(orderService.addCard(newCard)).rejects.toBeInstanceOf(
        ForbidenError,
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

  describe("deleteCard", () => {
    test("throw when order's group does not exist", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(null);

      await expect(
        orderService.deleteCard(userID, cardID),
      ).rejects.toBeInstanceOf(NotFoundError);

      expect(findGroupIDByOrderIDMock).toHaveBeenCalledWith(cardID);
      expect(checkGroupUserAccessMock).not.toHaveBeenCalled();
      expect(findCardByIDMock).not.toHaveBeenCalled();
      expect(deleteCardMock).not.toHaveBeenCalled();
    });

    test("throw when user not a member or creator", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(false);

      await expect(
        orderService.deleteCard(userID, cardID),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(userID, groupID);
      expect(findCardByIDMock).not.toHaveBeenCalled();
      expect(deleteCardMock).not.toHaveBeenCalled();
    });

    test("throw when card not exist", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findCardByIDMock.mockResolvedValue(null);

      await expect(
        orderService.deleteCard(userID, cardID),
      ).rejects.toBeInstanceOf(NotFoundError);

      expect(findCardByIDMock).toHaveBeenCalledWith(cardID);
      expect(deleteCardMock).not.toHaveBeenCalled();
    });

    test("throw user is not a creator of card", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findCardByIDMock.mockResolvedValue({
        author_id: wishlistID,
      } as CardDataRaw);

      await expect(
        orderService.deleteCard(userID, cardID),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(findCardByIDMock).toHaveBeenCalledWith(cardID);
      expect(deleteCardMock).not.toHaveBeenCalled();
    });

    test("correct delete card", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findCardByIDMock.mockResolvedValue({
        author_id: userID,
      } as CardDataRaw);

      await orderService.deleteCard(userID, cardID);

      expect(deleteCardMock).toHaveBeenCalledWith(cardID);
    });
  });

  describe("reserveOrder", () => {
    test("not group found", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(null);

      await expect(
        orderService.reserveOrder(userID, cardID),
      ).rejects.toBeInstanceOf(NotFoundError);

      expect(findGroupIDByOrderIDMock).toHaveBeenCalledWith(cardID);
      expect(checkGroupUserAccessMock).not.toHaveBeenCalled();
      expect(findCardByIDMock).not.toHaveBeenCalled();
      expect(reserveCardMock).not.toHaveBeenCalled();
    });

    test("user not a creator or member of group", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(false);

      await expect(
        orderService.reserveOrder(userID, cardID),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(userID, groupID);
      expect(findCardByIDMock).not.toHaveBeenCalled();
      expect(reserveCardMock).not.toHaveBeenCalled();
    });

    test("not card found", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findCardByIDMock.mockResolvedValue(null);

      await expect(
        orderService.reserveOrder(userID, cardID),
      ).rejects.toBeInstanceOf(NotFoundError);

      expect(findCardByIDMock).toHaveBeenCalledWith(cardID);
      expect(reserveCardMock).not.toHaveBeenCalled();
    });

    test("user is author of card", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findCardByIDMock.mockResolvedValue({ author_id: userID } as CardDataRaw);

      await expect(
        orderService.reserveOrder(userID, cardID),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(reserveCardMock).not.toHaveBeenCalled();
    });

    test("card alredy unreserved", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findCardByIDMock.mockResolvedValue({
        author_id: exampleUUID,
        status: "Забронировано",
      } as CardDataRaw);

      await expect(
        orderService.reserveOrder(userID, cardID),
      ).rejects.toBeInstanceOf(DataConflictError);

      expect(reserveCardMock).not.toHaveBeenCalled();
    });

    test("sucess reserve card", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findCardByIDMock.mockResolvedValue({
        author_id: exampleUUID,
        status: "Свободно",
      } as CardDataRaw);

      await expect(
        orderService.reserveOrder(userID, cardID),
      ).resolves.toBeUndefined();

      expect(reserveCardMock).toHaveBeenCalledWith(cardID, userID);
    });
  });

  describe("unResurvedOrder", () => {
    test("not group found", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(null);

      await expect(
        orderService.unReserveOrder(userID, cardID),
      ).rejects.toBeInstanceOf(NotFoundError);

      expect(findGroupIDByOrderIDMock).toHaveBeenCalledWith(cardID);
      expect(checkGroupUserAccessMock).not.toHaveBeenCalled();
      expect(findCardByIDMock).not.toHaveBeenCalled();
      expect(unReserveCardMock).not.toHaveBeenCalled();
    });

    test("user not a creator or member of group", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(false);

      await expect(
        orderService.unReserveOrder(userID, cardID),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(userID, groupID);
      expect(findCardByIDMock).not.toHaveBeenCalled();
      expect(unReserveCardMock).not.toHaveBeenCalled();
    });

    test("not card found", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findCardByIDMock.mockResolvedValue(null);

      await expect(
        orderService.unReserveOrder(userID, cardID),
      ).rejects.toBeInstanceOf(NotFoundError);

      expect(findCardByIDMock).toHaveBeenCalledWith(cardID);
      expect(unReserveCardMock).not.toHaveBeenCalled();
    });

    test("user is author of card", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findCardByIDMock.mockResolvedValue({ author_id: userID } as CardDataRaw);

      await expect(
        orderService.unReserveOrder(userID, cardID),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(unReserveCardMock).not.toHaveBeenCalled();
    });

    test("card unreserved", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findCardByIDMock.mockResolvedValue({
        author_id: exampleUUID,
        reserved_by: null,
      } as CardDataRaw);

      await expect(
        orderService.unReserveOrder(userID, cardID),
      ).rejects.toBeInstanceOf(DataConflictError);

      expect(unReserveCardMock).not.toHaveBeenCalled();
    });

    test("card gifted", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findCardByIDMock.mockResolvedValue({
        author_id: exampleUUID,
        reserved_by: exampleUUID,
        status: "Подарено",
      } as CardDataRaw);

      await expect(
        orderService.unReserveOrder(userID, cardID),
      ).rejects.toBeInstanceOf(DataConflictError);

      expect(unReserveCardMock).not.toHaveBeenCalled();
    });

    test("user not a reserver", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findCardByIDMock.mockResolvedValue({
        author_id: exampleUUID,
        reserved_by: exampleUUID,
        status: "Забронировано",
      } as CardDataRaw);

      await expect(
        orderService.unReserveOrder(userID, cardID),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(unReserveCardMock).not.toHaveBeenCalled();
    });

    test("sucess unresurv card", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findCardByIDMock.mockResolvedValue({
        author_id: exampleUUID,
        reserved_by: userID,
        status: "Забронировано",
      } as CardDataRaw);

      await expect(
        orderService.unReserveOrder(userID, cardID),
      ).resolves.toBeUndefined();

      expect(unReserveCardMock).toHaveBeenCalledWith(cardID);
    });
  });

  describe("markOrderAsGifted", () => {
    test("not group found", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(null);

      await expect(
        orderService.markOrderAsGifted(userID, cardID),
      ).rejects.toBeInstanceOf(NotFoundError);

      expect(findGroupIDByOrderIDMock).toHaveBeenCalledWith(cardID);
      expect(checkGroupUserAccessMock).not.toHaveBeenCalled();
      expect(findCardByIDMock).not.toHaveBeenCalled();
      expect(giveCardMock).not.toHaveBeenCalled();
    });

    test("user not a creator or member of group", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(false);

      await expect(
        orderService.markOrderAsGifted(userID, cardID),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(checkGroupUserAccessMock).toHaveBeenCalledWith(userID, groupID);
      expect(findCardByIDMock).not.toHaveBeenCalled();
      expect(giveCardMock).not.toHaveBeenCalled();
    });

    test("not card found", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findCardByIDMock.mockResolvedValue(null);

      await expect(
        orderService.markOrderAsGifted(userID, cardID),
      ).rejects.toBeInstanceOf(NotFoundError);

      expect(findCardByIDMock).toHaveBeenCalledWith(cardID);
      expect(giveCardMock).not.toHaveBeenCalled();
    });

    test("user is author of card", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findCardByIDMock.mockResolvedValue({ author_id: userID } as CardDataRaw);

      await expect(
        orderService.markOrderAsGifted(userID, cardID),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(giveCardMock).not.toHaveBeenCalled();
    });

    test("card unreserved", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findCardByIDMock.mockResolvedValue({
        author_id: exampleUUID,
        reserved_by: null,
      } as CardDataRaw);

      await expect(
        orderService.markOrderAsGifted(userID, cardID),
      ).rejects.toBeInstanceOf(DataConflictError);

      expect(giveCardMock).not.toHaveBeenCalled();
    });

    test("user not a reserver", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findCardByIDMock.mockResolvedValue({
        author_id: exampleUUID,
        reserved_by: exampleUUID,
      } as CardDataRaw);

      await expect(
        orderService.markOrderAsGifted(userID, cardID),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(giveCardMock).not.toHaveBeenCalled();
    });

    test("card gifted", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findCardByIDMock.mockResolvedValue({
        author_id: exampleUUID,
        reserved_by: userID,
        status: "Подарено",
      } as CardDataRaw);

      await expect(
        orderService.markOrderAsGifted(userID, cardID),
      ).rejects.toBeInstanceOf(DataConflictError);

      expect(giveCardMock).not.toHaveBeenCalled();
    });

    test("sucess give card", async () => {
      findGroupIDByOrderIDMock.mockResolvedValue(groupID);
      checkGroupUserAccessMock.mockResolvedValue(true);
      findCardByIDMock.mockResolvedValue({
        author_id: exampleUUID,
        reserved_by: userID,
        status: "Забронировано",
      } as CardDataRaw);

      await expect(
        orderService.markOrderAsGifted(userID, cardID),
      ).resolves.toBeUndefined();

      expect(giveCardMock).toHaveBeenCalledWith(cardID);
    });
  });
  // markOrderAsGifted(userID: UUID, cardID: number): Promise<void>;
});
