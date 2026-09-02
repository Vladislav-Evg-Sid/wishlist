import { useContext } from "react";

import {
  GroupsStoreContext,
  RootStoreContext,
} from "../context/store.context.ts";
import type { RootStore } from "../stores/RootStore.ts";
import { GroupStore } from "../stores/GroupStore.ts";

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
