import type { ParantInfo, UUID } from "../types/shared";
import type { WishlistData } from "../types/wishlists";
import { apiErrorHandler, apiFetch } from "./baseApi";

export async function getGroupWishlists(
  groupID: UUID,
): Promise<WishlistData[]> {
  const response = await apiFetch(`/wishlists/${groupID}`);

  if (!response.ok) {
    await apiErrorHandler(response);
  }

  return await response.json();
}

export async function createWishlist(
  groupID: UUID,
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
    await apiErrorHandler(response);
  }
}

export async function getWishlistInfo(wishlistID: UUID): Promise<ParantInfo> {
  const response = await apiFetch(`/wishlists/${wishlistID}/info`);

  if (!response.ok) {
    await apiErrorHandler(response);
  }

  const wishlistInfoRaw = await response.json();

  return {
    title: wishlistInfoRaw.title,
    isCreator: wishlistInfoRaw.is_creator,
  };
}

export async function deleteWishlist(wishlistID: UUID): Promise<void> {
  const response = await apiFetch(`/wishlists/${wishlistID}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    await apiErrorHandler(response);
  }
}

export async function updateWishlistName(
  wishlistID: UUID,
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
    await apiErrorHandler(response);
  }
}
