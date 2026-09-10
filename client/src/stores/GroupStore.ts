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
    } catch {
      toast.error("Ошибка при загрузке групп", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
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
    } catch {
      toast.error("Ошибка при создании группы", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
    }
  }
}
