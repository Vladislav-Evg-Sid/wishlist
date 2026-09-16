import { makeAutoObservable, runInAction } from "mobx";
import { Bounce, toast } from "react-toastify";

import type { WishlistData } from "../types/wishlists";
import { createWishlist, getGroupWishlists } from "../api/wishlists";

export class WishlistStore {
  wishlists: WishlistData[] = [];
  parantGroupID: string;

  constructor(parantGroupID: string) {
    makeAutoObservable(this);

    this.parantGroupID = parantGroupID;
    this.loadGroupWishlists();
  }

  async loadGroupWishlists() {
    try {
      const groupWishlists = await getGroupWishlists(this.parantGroupID);

      runInAction(() => {
        this.wishlists = groupWishlists;
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
              "Неизвестная ошибка.\nНе удалось получить вишлисты группы",
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

  async createWishlist(wishlistName: string) {
    try {
      await createWishlist(this.parantGroupID, wishlistName);
      toast.success("Вишлист создан", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      this.loadGroupWishlists();
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
              "Неизвестная ошибка.\nНе удалось получить вишлисты группы",
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
}
