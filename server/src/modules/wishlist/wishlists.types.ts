import { type Request } from "express";

export interface GetGroupWishlistParams {
  id: string;
}

export interface WishlistData {
  id: string;
  name: string;
}

export type GetGroupWishlistRequest = Request<
  GetGroupWishlistParams,
  WishlistData[]
>;
