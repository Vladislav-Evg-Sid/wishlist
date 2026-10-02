import type { UUID } from "../../types/shared.js";

export interface WishlistData {
  id: UUID;
  title: string;
}

export interface CreateWishlistData {
  groupID: UUID;
  creatorID: UUID;
  name: string;
}
