import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "react-toastify";

import type { OrderData, OrderID } from "../types/orders";
import { addOrder, editOrder, getWishlistOrders } from "../api/orders";
import type { WishIconValue } from "../constants/wishIcons";

export class OrderStore {
  orders: OrderData[] = [];
  parantWishlistID: string;
  parantWishlistTitle: string = "";

  constructor(parantWishlistID: string, parantWishlistTitle = "") {
    makeAutoObservable(this);

    this.parantWishlistID = parantWishlistID;
    this.parantWishlistTitle = parantWishlistTitle;
    this.loadWishlistOrders();
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

  deleteOrder(orderID: OrderID) {
    void orderID;
    toast.info("Функция удаления записи пока не доступна");
  }

  async editOrder(
    orderID: OrderID,
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

  reserveOrder(orderID: OrderID) {
    void orderID;
    toast.info("Функция бронирования записи пока не доступна");
  }

  cancelOrderReservation(orderID: OrderID) {
    void orderID;
    toast.info("Функция снятия брони пока не доступна");
  }

  markOrderAsGifted(orderID: OrderID) {
    void orderID;
    toast.info("Функция отметки подарка пока не доступна");
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
