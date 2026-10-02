import type { Request, Response } from "express";

import { type WishlistData } from "./wishlists.types.js";
import type { NoParams } from "../../types/requests.js";
import type { UUID } from "../../types/shared.js";

interface GetGroupWishlistParams {
  groupID: UUID;
}

type WishlistDataRes = WishlistData[] | string;

export type GetGroupWishlistRequestDTO = Request<
  GetGroupWishlistParams,
  WishlistDataRes
>;
export type GetGroupWishlistResponseDTO = Response<WishlistDataRes>;

interface CreateWishlistBody {
  group_id: UUID;
  title: string;
}

export type CreateWishlistRequestDTO = Request<
  NoParams,
  string,
  CreateWishlistBody
>;
export type CreateWishlistResponseDTO = Response<string>;
