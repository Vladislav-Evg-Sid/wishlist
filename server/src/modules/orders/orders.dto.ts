import type { Request, Response } from "express";

import type { CardData, status } from "./orders.types.js";
import type { NoParams } from "../../types/requests.js";
import type { UUID } from "../../types/shared.js";

// HTTP
interface GetWishlistCardsParams {
  wishlistID: UUID;
}

type GetWishlistCardsRes = CardData[] | string;

export type GetWishlistCardsRequestDTO = Request<
  GetWishlistCardsParams,
  GetWishlistCardsRes
>;
export type GetWishlistCardsResponseDTO = Response<GetWishlistCardsRes>;

interface AddCardBody {
  title: string;
  description: string;
  wishlist_id: UUID;
  icon: string;
  href: string;
}

export type AddCardRequestDTO = Request<NoParams, string, AddCardBody>;
export type AddCardResponseDTO = Response<string>;

// DB
export interface CardDataRaw {
  id: number;
  title: string;
  description: string;
  icon: string;
  created_at: string | Date;
  status: status;
  author_id: UUID;
  author_name: string;
  author_email: string;
  author_hash: number;
  reserved_by: string | null;
  href: string | null;
}
