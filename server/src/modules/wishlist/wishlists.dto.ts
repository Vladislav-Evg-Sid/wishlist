import type { Request, Response } from "express";

import { type WishlistData } from "./wishlists.types.js";
import type { NoParams } from "../../types/requests.js";

interface GetGroupWishlistParams {
  groupID: string;
}

type WishlistDataRes = WishlistData[] | string;

export type GetGroupWishlistRequestDTO = Request<
  GetGroupWishlistParams,
  WishlistDataRes
>;
export type GetGroupWishlistResponseDTO = Response<WishlistDataRes>;

interface CreateWishlistBody {
  group_id: string;
  title: string;
}

export type CreateWishlistRequestDTO = Request<
  NoParams,
  string,
  CreateWishlistBody
>;
export type CreateWishlistResponseDTO = Response<string>;
