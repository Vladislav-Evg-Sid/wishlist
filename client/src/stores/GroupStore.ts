import { makeAutoObservable, runInAction } from "mobx";
import { Bounce, toast } from "react-toastify";

import { createGroup, getUserGroups } from "../api/groups";
import type { GroupData } from "../types/groups";

export class GroupStore {
  groups: GroupData[] = [];

  constructor() {
    makeAutoObservable(this);

    this.loadUserGroups();
  }

  async loadUserGroups() {
    try {
      const userGroups = await getUserGroups();

      runInAction(() => {
        this.groups = userGroups;
      });
    } catch (error) {
      runInAction(() => {
        if (error instanceof Error) {
          switch (error.message) {
            case "Failed to fetch":
              toast.error("Сервис недоступен.\nПопробуйте позже", {
                position: "top-right",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
              });
              break;
            default:
              toast.error("Неизвестная ошибка.\nНе удалось загрузить группы", {
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
      });
    }
  }

  async createGroup(groupName: string) {
    try {
      await createGroup(groupName);
      toast.success("Группа успешно создана", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      this.loadUserGroups();
    } catch (error) {
      runInAction(() => {
        if (error instanceof Error) {
          switch (error.message) {
            case "Failed to fetch":
              toast.error("Сервис недоступен.\nПопробуйте позже", {
                position: "top-right",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
              });
              break;
            default:
              toast.error("Неизвестная ошибка.\nНе удалось создать группу", {
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
      });
    }
  }
}
