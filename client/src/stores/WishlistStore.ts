import { makeAutoObservable } from "mobx";

import type { RootStore } from "./RootStore";
import type { Wishlist } from "../types/wishlists";

export class WishlistStore {
  rootStore: RootStore;
  wishlists: Wishlist[] = [];
  loading: boolean = false;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }
}
