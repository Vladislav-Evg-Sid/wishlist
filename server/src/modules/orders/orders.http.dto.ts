import type { Request, Response } from "express";
import type z from "zod";

import type { CardData } from "./orders.types.js";
import type { NoParams } from "../../types/requests.js";
import {
  getWishlistCardsParamsSchema,
  addCardBodySchema,
} from "./orders.schemas.js";

interface GetWishlistCardsLocals {
  validateParams: z.output<typeof getWishlistCardsParamsSchema>;
}

export type GetWishlistCardsRequestDTO = Request<
  z.input<typeof getWishlistCardsParamsSchema>,
  CardData[]
>;
export type GetWishlistCardsResponseDTO = Response<
  CardData[],
  GetWishlistCardsLocals
>;

interface AddCardLocals {
  validateBody: z.output<typeof addCardBodySchema>;
}

export type AddCardRequestDTO = Request<
  NoParams,
  NoParams,
  z.input<typeof addCardBodySchema>
>;
export type AddCardResponseDTO = Response<NoParams, AddCardLocals>;
