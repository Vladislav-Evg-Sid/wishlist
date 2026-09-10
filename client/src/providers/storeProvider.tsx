import { useState } from "react";

import { rootStore } from "../stores/RootStore";
import {
  GroupsStoreContext,
  RootStoreContext,
  WishlistStoreContext,
} from "../context/store.context";
import { GroupStore } from "../stores/GroupStore";
import { WishlistStore } from "../stores/WishlistStore";

interface StoreProviderProps {
  children: React.ReactNode;
}

export function RootStoreProvider({ children }: StoreProviderProps) {
  return <RootStoreContext value={rootStore}>{children}</RootStoreContext>;
}

export function GroupStoreProvider({ children }: StoreProviderProps) {
  const [groupContext] = useState(() => new GroupStore());

  return (
    <GroupsStoreContext value={groupContext}>{children}</GroupsStoreContext>
  );
}
interface WishlistStoreProviderProps {
  children: React.ReactNode;
  groupID: string;
}

export function WishlistStoreProvider({
  children,
  groupID,
}: WishlistStoreProviderProps) {
  const [wishlistContext] = useState(() => new WishlistStore(groupID));

  return (
    <WishlistStoreContext value={wishlistContext}>
      {children}
    </WishlistStoreContext>
  );
}
