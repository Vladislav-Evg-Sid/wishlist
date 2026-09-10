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
}

export function GroupStoreProvider({ children }: GroupStoreProviderProps) {
  const [groupContext] = useState(() => new GroupStore());

  return (
    <GroupsStoreContext value={groupContext}>{children}</GroupsStoreContext>
  );
}
