import { makeAutoObservable, runInAction } from "mobx";
import { Bounce, toast } from "react-toastify";

import type { WishlistData } from "../types/wishlists";
import { getGroupWishlists } from "../api/wishlists";

export class WishlistStore {
  wishlists: WishlistData[] = [];
  parantGroupID: string;

  constructor(parantGroupID: string) {
    makeAutoObservable(this);

    this.parantGroupID = parantGroupID;
  }

  async loadGroupWishlists() {
    try {
      const groupWishlists = await getGroupWishlists(this.parantGroupID);

      runInAction(() => {
        this.wishlists = groupWishlists;
      });
    } catch {
      toast.error("Ошибка при загрузке вишлистов", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
    }
  }
}
