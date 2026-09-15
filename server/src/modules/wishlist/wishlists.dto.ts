import type { Request, Response } from "express";

import {
  type WishlistData,
  type GetGroupWishlistParams,
} from "./wishlists.types.js";

type WishlistDataRes = WishlistData[] | string;

export type GetGroupWishlistRequestDTO = Request<
  GetGroupWishlistParams,
  WishlistDataRes
>;
export type GetGroupWishlistResponseDTO = Response<WishlistDataRes>;
