import type { Request } from "express";

import {
  type WishlistData,
  type GetGroupWishlistParams,
} from "./wishlists.types.js";

export type GetGroupWishlistRequestDTO = Request<
  GetGroupWishlistParams,
  WishlistData[]
>;
