import type { Request, Response } from "express";
import type z from "zod";

import { type WishlistData } from "./wishlists.types.js";
import type { NoParams } from "../../types/requests.js";
import type { UUID } from "../../types/shared.js";
import type {
  createWishlistBodySchema,
  getGroupWishlistsParamsSchema,
} from "./wishlists.schemas.js";

// GetGroupWishlists
interface GetGroupWishlistLocals {
  validateParams: z.output<typeof getGroupWishlistsParamsSchema>;
}

export type GetGroupWishlistRequestDTO = Request<
  z.input<typeof getGroupWishlistsParamsSchema>,
  WishlistData[]
>;
export type GetGroupWishlistResponseDTO = Response<
  WishlistData[],
  GetGroupWishlistLocals
>;

// CreateWishlist
interface CreateWishlistLocals {
  validateBody: z.output<typeof createWishlistBodySchema>;
}

export type CreateWishlistRequestDTO = Request<
  NoParams,
  string,
  z.input<typeof createWishlistBodySchema>
>;
export type CreateWishlistResponseDTO = Response<string, CreateWishlistLocals>;
