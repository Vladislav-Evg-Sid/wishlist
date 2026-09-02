import { makeAutoObservable } from "mobx";

import { AuthStore } from "./AuthStore";
import { UserStore } from "./UserStore";
import { WishlistStore } from "./WishlistStore";

export class RootStore {
  authStore: AuthStore;
  userStore: UserStore;
  wishlistStore: WishlistStore;

  constructor() {
    makeAutoObservable(this);
    this.authStore = new AuthStore(this);
    this.userStore = new UserStore(this);
    this.wishlistStore = new WishlistStore(this);
  }
}

export const rootStore = new RootStore();
