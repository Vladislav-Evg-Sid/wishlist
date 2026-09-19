import { useState } from "react";

import { rootStore } from "../stores/RootStore";
import {
  GroupsStoreContext,
  OrderStoreContext,
  RootStoreContext,
  WishlistStoreContext,
} from "../context/store.context";
import { GroupStore } from "../stores/GroupStore";
import { WishlistStore } from "../stores/WishlistStore";
import { OrderStore } from "../stores/OrderStore";

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

interface OrderStoreProviderProps {
  children: React.ReactNode;
  wishlistID: string;
  wishlistTitle?: string;
}

export function OrderStoreProvider({
  children,
  wishlistID,
  wishlistTitle = "",
}: OrderStoreProviderProps) {
  const [orderContext] = useState(
    () => new OrderStore(wishlistID, wishlistTitle),
  );

  return <OrderStoreContext value={orderContext}>{children}</OrderStoreContext>;
}
