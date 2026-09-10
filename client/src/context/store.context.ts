import { createContext } from "react";

import type { RootStore } from "../stores/RootStore";
import { GroupStore } from "../stores/GroupStore";
import type { WishlistStore } from "../stores/WishlistStore";

export const RootStoreContext = createContext<RootStore | null>(null);

export const GroupsStoreContext = createContext<GroupStore | null>(null);

export const WishlistStoreContext = createContext<WishlistStore | null>(null);
