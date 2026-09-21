import { makeAutoObservable, runInAction } from "mobx";
import { Bounce, toast } from "react-toastify";

import type { OrderData, OrderID } from "../types/orders";
import { addOrder, getWishlistOrders } from "../api/orders";
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
              {
                position: "top-right",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
              },
            );
            break;
          case "Failed to fetch":
            toast.error("Сервис недоступен.\nПопробуйте позже", {
              position: "top-right",
              autoClose: 5000,
              theme: "light",
              transition: Bounce,
            });
            break;
          default:
            toast.error(
              "Неизвестная ошибка.\nНе удалось получить записи вишлиста",
              {
                position: "top-right",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
              },
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
      toast.info("Введите название записи", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
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
      toast.success("Запись создана", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      this.loadWishlistOrders();
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case "User not a member or creator":
            toast.error(
              "Отказано в доступе!\nВы не являетесь создателем или участником группы",
              {
                position: "top-right",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
              },
            );
            break;
          case "Failed to fetch":
            toast.error("Сервис недоступен.\nПопробуйте позже", {
              position: "top-right",
              autoClose: 5000,
              theme: "light",
              transition: Bounce,
            });
            break;
          default:
            toast.error("Неизвестная ошибка.\nНе удалось создать запись", {
              position: "top-right",
              autoClose: 5000,
              theme: "light",
              transition: Bounce,
            });
            console.error(error.message);
            break;
        }
      } else {
        console.error(error);
      }
    }
  }

  // TODO: подключить методы API и обновлять orders после успешных действий.
  deleteOrder(orderID: OrderID) {
    void orderID;
    toast.info("Функция удаления записи пока не доступна");
  }

  editOrder(orderID: OrderID) {
    void orderID;
    toast.info("Функция редактирования записи пока не доступна");
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
