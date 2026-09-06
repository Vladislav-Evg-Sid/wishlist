import { useState } from "react";

import { rootStore } from "../stores/RootStore";
import { GroupsStoreContext, RootStoreContext } from "../context/store.context";
import { GroupStore } from "../stores/GroupStore";

interface RootStoreProviderProps {
  children: React.ReactNode;
}

export function RootStoreProvider({ children }: RootStoreProviderProps) {
  return <RootStoreContext value={rootStore}>{children}</RootStoreContext>;
}

interface GroupStoreProviderProps {
  children: React.ReactNode;
  userID: string;
}

export function GroupStoreProvider({
  userID,
  children,
}: GroupStoreProviderProps) {
  const [groupContext] = useState(() => new GroupStore(userID));

  return (
    <GroupsStoreContext value={groupContext}>{children}</GroupsStoreContext>
  );
}
