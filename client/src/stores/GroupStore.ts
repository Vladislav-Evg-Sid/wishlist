import { makeAutoObservable, reaction, runInAction } from "mobx";

import type { RootStore } from "./RootStore";
import getUserGroups from "../api/groups";
import { type Group } from "../types/groups";

export class GroupStore {
  rootStore: RootStore;
  groups: Group[] = [];
  loading: boolean = false;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;

    reaction(
      () => this.rootStore.userStore.currentUser?.id,
      () => this.loadUserGroups(),
    );
  }

  async loadUserGroups() {
    if (this.rootStore.userStore.currentUser === undefined) {
      alert("Не авторизован");
      return;
    }

    const userGroups = await getUserGroups(
      this.rootStore.userStore.currentUser.id,
    );

    runInAction(() => {
      this.groups = userGroups;
    });
  }
}
