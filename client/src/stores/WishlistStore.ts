import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "react-toastify";

import type { GroupUsersList, WishlistData } from "../types/wishlists";
import { createWishlist, getGroupWishlists } from "../api/wishlists";
import { getGroupInfo, getGroupUsers } from "../api/groups";

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
    this.loadParantGroupUsers();
  }

  async loadParantGroupInfo() {
    try {
      const { isCreator, title } = await getGroupInfo(this.parantGroupID);

      runInAction(() => {
        this.isParantGroupCreator = isCreator;
        this.parantGroupTitle = title;
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
              "Неизвестная ошибка.\nНе удалось получить данные о группе",
            );
            console.error(error.message);
            break;
        }
      } else {
        console.error(error);
      }
    }
  }

  async loadParantGroupUsers() {
    try {
      const users = await getGroupUsers(this.parantGroupID);
      runInAction(() => {
        this.parantGroupUsers = users;
      });
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case "User not a member or creator":
            toast.error(
              "Отказано в доступе!\nВы не являетесь создателем или участником группы",
            );
            break;
          case "Group's creator not found":
            toast.error("Ошибка! Не обнаружен создатель группы!");
            break;
          case "Failed to fetch":
            toast.error("Сервис недоступен.\nПопробуйте позже");
            break;
          default:
            toast.error(
              "Неизвестная ошибка.\nНе удалось получить участников группы",
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
            );
            break;
          case "Failed to fetch":
            toast.error("Сервис недоступен.\nПопробуйте позже");
            break;
          default:
            toast.error(
              "Неизвестная ошибка.\nНе удалось получить вишлисты группы",
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
      toast.success("Вишлист создан");
      this.loadGroupWishlists();
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
            toast.error("Неизвестная ошибка.\nНе удалось создать вишлист");
            console.error(error.message);
            break;
        }
      } else {
        console.error(error);
      }
    }
  }
}
