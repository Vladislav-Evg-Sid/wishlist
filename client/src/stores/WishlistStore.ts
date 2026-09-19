import { makeAutoObservable, runInAction } from "mobx";
import { Bounce, toast } from "react-toastify";

import type { GroupUsersList, WishlistData } from "../types/wishlists";
import { createWishlist, getGroupWishlists } from "../api/wishlists";
import { getGroupInfo } from "../api/groups";

export class WishlistStore {
  wishlists: WishlistData[] = [];
  parantGroupID: string;
  parantGroupTitle: string = "";
  isParantGroupCreator: boolean = false;
  parantGroupUsers: GroupUsersList | null = null;

  constructor(parantGroupID: string) {
    makeAutoObservable(this);

    this.parantGroupID = parantGroupID;
    this.loadGroupWishlists();
    this.loadParantGroupInfo();
  }

  async loadParantGroupInfo() {
    try {
      const { isCreator, title } = await getGroupInfo(this.parantGroupID);

      this.isParantGroupCreator = isCreator;
      this.parantGroupTitle = title;
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
