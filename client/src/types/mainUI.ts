import type { User } from "./user";

export type UIType = "groups" | "wishlicts";

export interface CurrentUI {
  page: UIType;
  parantID?: string;
}

export type PageActions = "goBack" | "goForvard";

export interface ReducerUIAction {
  type: PageActions;
  parantID?: string;
}

export interface GroupsProps {
  user: User;
  dispatchUI: (action: ReducerUIAction) => void;
}
