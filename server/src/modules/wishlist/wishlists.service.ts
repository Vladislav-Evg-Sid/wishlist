import { checkGroupUserAccess } from "../../shared/checkUserGroup.js";
import type { UUID } from "../../types/shared.js";
import { createWishlist, findGroupWishlists } from "./wishlists.repository.js";
import type { CreateWishlistData, WishlistData } from "./wishlists.types.js";

export async function getGroupWishlists(
  userID: UUID,
  groupID: UUID,
): Promise<WishlistData[]> {
  const userAccess = await checkGroupUserAccess(userID, groupID);
  if (!userAccess) {
    throw new Error("User not a member or creator");
  }

  return findGroupWishlists(groupID);
}

export async function addWishlist(wishlist: CreateWishlistData): Promise<void> {
  const userAccess = await checkGroupUserAccess(
    wishlist.creatorID,
    wishlist.groupID,
  );
  if (!userAccess) {
    throw new Error("User not a member or creator");
  }

  await createWishlist(wishlist);
}
