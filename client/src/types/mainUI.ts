import { type User } from "./user";
import { type WishlistGroup } from "./groups";
import { type Wishlist } from "./wishlists";

export type UIType = "groups" | "wishlists";

export interface CurrentUI {
  page: UIType;
  parantElement?: WishlistGroup;
}

export type PageActions = "goBack" | "goForvard";

export interface ReducerUIAction {
  type: PageActions;
  parantElement?: WishlistGroup | Wishlist;
}

export interface GroupsProps {
  user: User;
  dispatchUI: (action: ReducerUIAction) => void;
}

export interface WishlistsProps {
  group?: WishlistGroup;
  dispatchUI: (action: ReducerUIAction) => void;
}
