import type { Wishlist } from "./wishlists";

export type Groups = Map<string, string>;

export interface GroupData {
  id: string;
  name: string;
  wishlists: Wishlist[];
}
