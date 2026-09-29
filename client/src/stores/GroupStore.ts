import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "react-toastify";

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
              toast.error("Сервис недоступен.\nПопробуйте позже");
              break;
            default:
              toast.error("Неизвестная ошибка.\nНе удалось загрузить группы");
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
      toast.success("Группа успешно создана");
      this.loadUserGroups();
    } catch (error) {
      runInAction(() => {
        if (error instanceof Error) {
          switch (error.message) {
            case "Failed to fetch":
              toast.error("Сервис недоступен.\nПопробуйте позже");
              break;
            default:
              toast.error("Неизвестная ошибка.\nНе удалось создать группу");
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
