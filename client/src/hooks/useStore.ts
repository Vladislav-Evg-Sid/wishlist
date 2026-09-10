import { useContext } from "react";

import {
  GroupsStoreContext,
  RootStoreContext,
  WishlistStoreContext,
} from "../context/store.context.ts";
import type { RootStore } from "../stores/RootStore.ts";
import { GroupStore } from "../stores/GroupStore.ts";
import { WishlistStore } from "../stores/WishlistStore.ts";

export function useStore(): RootStore {
  const store = useContext(RootStoreContext);

  if (!store) {
    throw new Error("useStore must be used inside RootStoreProvider");
  }

  return store;
}

export function useStoreGroups(): GroupStore {
  const store = useContext(GroupsStoreContext);

  if (!store) {
    throw new Error("useStore must be used inside GroupStoreProvider");
  }

  return store;
}

export function useStoreWishlists(): WishlistStore {
  const store = useContext(WishlistStoreContext);

  if (!store) {
    throw new Error("useStore must be used inside WishlistStoreProvider");
  }

  return store;
}
