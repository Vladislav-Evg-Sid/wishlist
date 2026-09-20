import type { Request, Response } from "express";
import type { CardData, status } from "./orders.types.js";
import type { NoParams } from "../../types/requests.js";

// HTTP
interface GetWishlistCardsParams {
  wishlistID: string;
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
  wishlist_id: string;
  icon: string;
  href: string;
}

export type AddCardRequestDTO = Request<NoParams, string, AddCardBody>;
export type AddCardResponseDTO = Response<string>;

// DB
export interface CardDataRaw {
  id: string;
  title: string;
  icon: string;
  created_at: string | Date;
  status: status;
  author_id: string;
  author_name: string;
  author_email: string;
  author_hash: number;
  href: string | null;
}
