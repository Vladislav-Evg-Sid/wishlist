import { makeAutoObservable, runInAction } from "mobx";
import { Bounce, toast } from "react-toastify";

import { createGroup, getUserGroups } from "../api/groups";
import type { Groups } from "../types/groups";

export class GroupStore {
  groups: Groups = new Map();
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);

    this.loadUserGroups();
  }

  async loadUserGroups() {
    const userGroups = await getUserGroups();

    runInAction(() => {
      this.groups = userGroups;
    });
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
