import type { Request, Response } from "express";
import type { CardData, status } from "./orders.types.js";

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
