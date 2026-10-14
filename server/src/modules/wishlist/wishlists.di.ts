import type { UUID } from "../../types/shared.js";
import type { WishlistInfoRaw } from "./wishlists.repository.dto.js";
import type {
  CreateWishlistData,
  WishlistData,
  wishlistInfo,
} from "./wishlists.types.js";

export const WISHLIST_REPOSITORY = Symbol("WISHLIST_REPOSITORY");

export interface WishlistsRepositoryInterface {
  findGroupWishlists(groupID: UUID): Promise<WishlistData[]>;
  createWishlist(wishlist: CreateWishlistData): Promise<string>;
  findWishlistInfo(wishlistID: UUID): Promise<WishlistInfoRaw>;
  deleteWishlist(wishlistID: UUID): Promise<void>;
  updateWishlistName(wishlistID: UUID, newName: string): Promise<void>;
  findGroupIDByWishlistID(wishlistID: UUID): Promise<UUID | null>;
}

export const WISHLIST_SERVICE = Symbol("WISHLIST_SERVICE");

export interface WishlistsServiceInterface {
  getGroupWishlists(userID: UUID, groupID: UUID): Promise<WishlistData[]>;
  addWishlist(wishlist: CreateWishlistData): Promise<void>;
  getWishlistInfo(userID: UUID, wishlistID: UUID): Promise<wishlistInfo>;
  deleteWishlist(userID: UUID, wishlistID: UUID): Promise<void>;
  updateWishlistName(
    userID: UUID,
    wishlistID: UUID,
    newName: string,
  ): Promise<void>;
}
