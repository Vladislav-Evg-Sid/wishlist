import { makeAutoObservable } from "mobx";

import { AuthStore } from "./AuthStore";
import { UserStore } from "./UserStore";
import { GroupStore } from "./GroupStore";
import { WishlistStore } from "./WishlistStore";

export class RootStore {
  authStore: AuthStore;
  userStore: UserStore;
  groupStore: GroupStore;
  wishlistStore: WishlistStore;

  constructor() {
    makeAutoObservable(this);
    this.authStore = new AuthStore(this);
    this.userStore = new UserStore(this);
    this.groupStore = new GroupStore(this);
    this.wishlistStore = new WishlistStore(this);
  }
}

export const rootStore = new RootStore();
