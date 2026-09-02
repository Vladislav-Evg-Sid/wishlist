import { rootStore } from "../stores/RootStore";
import { StoreContext } from "./RootStore.context";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <StoreContext value={rootStore}>{children}</StoreContext>;
}
