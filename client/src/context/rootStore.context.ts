import { createContext } from "react";

import type { RootStore } from "../stores/RootStore";

export const StoreContext = createContext<RootStore | null>(null);
