import { createContext } from "react";

import type { RootStore } from "../stores/RootStore";
import { GroupStore } from "../stores/GroupStore";

export const RootStoreContext = createContext<RootStore | null>(null);

export const GroupsStoreContext = createContext<GroupStore | null>(null);
