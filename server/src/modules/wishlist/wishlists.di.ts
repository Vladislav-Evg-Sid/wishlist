import type { UUID } from "../../types/shared.js";
import type { CreateWishlistData, WishlistData } from "./wishlists.types.js";

export const WISHLIST_REPOSITORY = Symbol("WISHLIST_REPOSITORY");

export interface WishlistsRepositoryInterface {
  findGroupWishlists(groupID: UUID): Promise<WishlistData[]>;
  createWishlist(wishlist: CreateWishlistData): Promise<string>;
}

export const WISHLIST_SERVICE = Symbol("WISHLIST_SERVICE");

export interface WishlistsServiceInterface {
  getGroupWishlists(userID: UUID, groupID: UUID): Promise<WishlistData[]>;
  addWishlist(wishlist: CreateWishlistData): Promise<void>;
}
