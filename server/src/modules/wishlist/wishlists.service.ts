import {
  checkWishlistUserAccess,
  findGroupWishlists,
} from "./wishlists.repository.js";
import type { WishlistData } from "./wishlists.types.js";

export async function getGroupWishlists(
  userID: string,
  groupID: string,
): Promise<WishlistData[]> {
  const userAccess = await checkWishlistUserAccess(userID, groupID);
  if (!userAccess) {
    throw new Error("User not a member or creator");
  }

  return findGroupWishlists(groupID);
}
