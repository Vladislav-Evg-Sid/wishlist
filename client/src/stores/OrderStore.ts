import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "react-toastify";

import type { OrderData } from "../types/orders";
import {
  addOrder,
  deleteOrder,
  editOrder,
  getWishlistOrders,
  giveOrder,
  reserveOrder,
  unreserveOrder,
} from "../api/orders";
import type { WishIconValue } from "../constants/wishIcons";
import {
  deleteWishlist,
  getWishlistInfo,
  updateWishlistName,
} from "../api/wishlists";

export class OrderStore {
  orders: OrderData[] = [];
  parantWishlistID: string;
  parantWishlistTitle: string = "";
  isParantWishlistCreator: boolean = true;

  constructor(parantWishlistID: string) {
    makeAutoObservable(this);

    this.parantWishlistID = parantWishlistID;
    this.loadParantWishlistInfo();
    this.loadWishlistOrders();
  }

  async loadParantWishlistInfo() {
    try {
      const { isCreator, title } = await getWishlistInfo(this.parantWishlistID);

      runInAction(() => {
        this.isParantWishlistCreator = isCreator;
        this.parantWishlistTitle = title;
      });
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case "User not a member or creator":
            toast.error(
              "Отказано в доступе!\nВы не являетесь создателем или участником группы",
            );
            break;
          case "Failed to fetch":
            toast.error("Сервис недоступен.\nПопробуйте позже");
            break;
          default:
            toast.error(
              "Неизвестная ошибка.\nНе удалось получить данные о вишлисте",
            );
            console.error(error.message);
            break;
        }
      } else {
        console.error(error);
      }
    }
  }

  async loadWishlistOrders() {
    try {
      const orders = await getWishlistOrders(this.parantWishlistID);

      runInAction(() => {
        this.orders = orders;
      });
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case "User not a member or creator":
            toast.error(
              "Отказано в доступе!\nВы не являетесь создателем или участником группы",
            );
            break;
          case "Not found wishlist's group":
            toast.error("Вишлист или группа не существует");
            break;
          case "Failed to fetch":
            toast.error("Сервис недоступен.\nПопробуйте позже");
            break;
          default:
            toast.error(
              "Неизвестная ошибка.\nНе удалось получить записи вишлиста",
            );
            console.error(error.message);
            break;
        }
      } else {
        console.error(error);
      }
    }
  }

  async updateParantWishlistName(wishlistName: string) {
    if (wishlistName === "") {
      toast.info("Название вишлиста не может быть пустым");
      return;
    }
    try {
      await updateWishlistName(this.parantWishlistID, wishlistName);

      runInAction(() => {
        this.parantWishlistTitle = wishlistName;
        toast.success("Название вишлиста обновлено");
      });
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case "User not a member or creator":
            toast.error(
              "Отказано в доступе!\nВы не являетесь участником или создателем группы",
            );
            break;
          case "User not a creator":
            toast.error(
              "Отказано в доступе!\nВы не являетесь создателем вишлиста",
            );
            break;
          case "Failed to fetch":
            toast.error("Сервис недоступен.\nПопробуйте позже");
            break;
          default:
            toast.error("Неизвестная ошибка.\nНе удалось создать вишлист");
            console.error(error.message);
            break;
        }
      } else {
        console.error(error);
      }
    }
  }

  async deleteParantWishlist() {
    try {
      await deleteWishlist(this.parantWishlistID);
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case "User not a member or creator":
            toast.error(
              "Отказано в доступе!\nВы не являетесь участником или создателем группы",
            );
            break;
          case "User not a creator":
            toast.error(
              "Отказано в доступе!\nВы не являетесь создателем вишлиста",
            );
            break;
          case "Failed to fetch":
            toast.error("Сервис недоступен.\nПопробуйте позже");
            break;
          default:
            toast.error("Неизвестная ошибка.\nНе удалось удлить вишлист");
            console.error(error.message);
            break;
        }
      } else {
        console.error(error);
      }
    }
  }

  async createOrder(
    cardName: string,
    description: string,
    icon: WishIconValue,
    href: string,
  ) {
    if (!cardName) {
      toast.info("Введите название записи");
      return;
    }
    try {
      await addOrder({
        title: cardName,
        description: description,
        wishlistID: this.parantWishlistID,
        icon: icon,
        href: href,
      });
      toast.success("Запись создана");
      this.loadWishlistOrders();
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case "User not a member or creator":
            toast.error(
              "Отказано в доступе!\nВы не являетесь создателем или участником группы",
            );
            break;
          case "Failed to fetch":
            toast.error("Сервис недоступен.\nПопробуйте позже");
            break;
          default:
            toast.error("Неизвестная ошибка.\nНе удалось создать запись");
            console.error(error.message);
            break;
        }
      } else {
        console.error(error);
      }
    }
  }

  async deleteOrder(orderID: number) {
    try {
      await deleteOrder(orderID);
      toast.success("Запись удалена");
      this.loadWishlistOrders();
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case "User not a member or creator":
            toast.error(
              "Отказано в доступе!\nВы не являетесь создателем или участником группы",
            );
            break;
          case "Failed to fetch":
            toast.error("Сервис недоступен.\nПопробуйте позже");
            break;
          default:
            toast.error("Неизвестная ошибка.\nНе удалось удалить запись");
            console.error(error.message);
            break;
        }
      } else {
        console.error(error);
      }
    }
  }

  async editOrder(
    orderID: number,
    cardName: string,
    description: string,
    icon: WishIconValue,
    href: string,
  ) {
    if (!cardName) {
      toast.info("название записи не может быть пустым");
      return;
    }
    try {
      await editOrder({
        currentID: orderID,
        title: cardName,
        icon,
        description,
        href,
      });
      toast.success("Запись обновлена");
      this.loadWishlistOrders();
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case "User not a member or creator":
            toast.error(
              "Отказано в доступе!\nВы не являетесь создателем или участником группы",
            );
            break;
          case "Failed to fetch":
            toast.error("Сервис недоступен.\nПопробуйте позже");
            break;
          default:
            toast.error("Неизвестная ошибка.\nНе удалось обновить запись");
            console.error(error.message);
            break;
        }
      } else {
        console.error(error);
      }
    }
  }

  async reserveOrder(orderID: number) {
    try {
      await reserveOrder(orderID);
      await this.loadWishlistOrders();
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case "User not a member or creator":
            toast.error(
              "Отказано в доступе!\nВы не являетесь создателем или участником группы",
            );
            break;
          case "Failed to fetch":
            toast.error("Сервис недоступен.\nПопробуйте позже");
            break;
          default:
            toast.error("Неизвестная ошибка.\nНе удалось обновить запись");
            console.error(error.message);
            break;
        }
      } else {
        console.error(error);
      }
    }
  }

  async cancelOrderReservation(orderID: number) {
    try {
      await unreserveOrder(orderID);
      await this.loadWishlistOrders();
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case "User not a member or creator":
            toast.error(
              "Отказано в доступе!\nВы не являетесь создателем или участником группы",
            );
            break;
          case "Failed to fetch":
            toast.error("Сервис недоступен.\nПопробуйте позже");
            break;
          default:
            toast.error("Неизвестная ошибка.\nНе удалось обновить запись");
            console.error(error.message);
            break;
        }
      } else {
        console.error(error);
      }
    }
  }

  async markOrderAsGifted(orderID: number) {
    try {
      await giveOrder(orderID);
      await this.loadWishlistOrders();
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case "User not a member or creator":
            toast.error(
              "Отказано в доступе!\nВы не являетесь создателем или участником группы",
            );
            break;
          case "Failed to fetch":
            toast.error("Сервис недоступен.\nПопробуйте позже");
            break;
          default:
            toast.error("Неизвестная ошибка.\nНе удалось обновить запись");
            console.error(error.message);
            break;
        }
      } else {
        console.error(error);
      }
    }
  }

  get countOrders(): number {
    return this.orders.length;
  }

  get countReservedOrders(): number {
    return this.orders.filter((order) => order.status === "Забронировано")
      .length;
  }

  get countGiftedOrders(): number {
    return this.orders.filter((order) => order.status === "Подарено").length;
  }
}

export default OrderStore;
