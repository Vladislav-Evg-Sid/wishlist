import type { ParantInfo } from "../types/shared";
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

export async function getWishlistInfo(wishlistID: string): Promise<ParantInfo> {
  const response = await apiFetch(`/wishlists/${wishlistID}/info`);

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("User not a member or creator");
    }
    throw new Error(`${response.status}`);
  }

  const wishlistInfoRaw = await response.json();

  return {
    title: wishlistInfoRaw.title,
    isCreator: wishlistInfoRaw.is_creator,
  };
}

export async function deleteWishlist(wishlistID: string): Promise<void> {
  const response = await apiFetch(`/wishlists/${wishlistID}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    if (response.status === 403) {
      const errorDetails = await response.json();
      throw new Error(errorDetails.message);
    }
    throw new Error(`${response.status}`);
  }
}

export async function updateWishlistName(
  wishlistID: string,
  wishlistName: string,
): Promise<void> {
  const response = await apiFetch(`/wishlists/${wishlistID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: wishlistName,
    }),
  });

  if (!response.ok) {
    if (response.status === 403) {
      const errorDetails = await response.json();
      throw new Error(errorDetails.message);
    }
    throw new Error(`${response.status}`);
  }
}
