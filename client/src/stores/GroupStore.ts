import { makeAutoObservable, reaction, runInAction } from "mobx";

import type { RootStore } from "./RootStore";
import getUserGroups from "../api/groups";
import type { Groups, GroupData } from "../types/groups";
import getWishlistsByGroup from "../api/wishlists";

export class GroupStore {
  rootStore: RootStore;
  groups: Groups = new Map();
  currentGroup: GroupData | null = null;
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

  async loadGroupWishlist(groupId: string) {
    const groupWishlists = await getWishlistsByGroup(groupId);

    runInAction(() => {
      this.currentGroup = {
        id: groupId,
        name: this.groups.get(groupId) ?? "",
        wishlists: groupWishlists,
      };
    });
  }
}
