import { makeAutoObservable, runInAction } from "mobx";

import getUserGroups from "../api/groups";
import type { Groups, GroupData } from "../types/groups";
import getWishlistsByGroup from "../api/wishlists";

export class GroupStore {
  groups: Groups = new Map();
  currentGroup: GroupData | null = null;
  loading: boolean = false;

  constructor(userID: string) {
    makeAutoObservable(this);

    this.loadUserGroups(userID);
  }

  async loadUserGroups(userID: string) {
    const userGroups = await getUserGroups(userID);

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
