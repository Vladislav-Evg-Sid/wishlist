import { makeAutoObservable, runInAction } from "mobx";

import getUserGroups from "../api/groups";
import type { Groups, GroupData } from "../types/groups";
import getWishlistsByGroup from "../api/wishlists";

export class GroupStore {
  groups: Groups = new Map();
  currentGroup: GroupData | null = null;
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
