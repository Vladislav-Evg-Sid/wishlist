import type { WishlistData } from "../types/wishlists";
import { apiFetch } from "./baseApi";

export async function getGroupWishlists(
  groupID: string,
): Promise<WishlistData[]> {
  const response = await apiFetch(`/wishlists/${groupID}`);
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("User not a member or creator");
    }
    throw new Error(`${response.status}`);
  }

  return await response.json();
}

export async function createWishlist(
  groupID: string,
  wishlistName: string,
): Promise<void> {
  const response = await apiFetch("/wishlists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ group_id: groupID, title: wishlistName }),
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("User not a member or creator");
    }
    throw new Error(`${response.status}`);
  }
}
