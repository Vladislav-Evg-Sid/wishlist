import { number, z } from "zod";

import { UUIDSchema } from "../../shared/zodUUID.js";

export const getWishlistCardsParamsSchema = z
  .object({
    wishlist_id: UUIDSchema,
  })
  .transform((data) => ({
    wishlistID: data.wishlist_id,
  }));

export const addCardBodySchema = z
  .object({
    title: z.string(),
    description: z.string(),
    wishlist_id: UUIDSchema,
    icon: z.string(),
    href: z.string(),
  })
  .transform((data) => ({
    title: data.title,
    description: data.description,
    wishlistID: data.wishlist_id,
    icon: data.icon,
    href: data.href,
  }));

export const updateCardBopySchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  href: z.string(),
});

export const updateCardParamsSchema = z
  .object({
    order_id: z.string(),
  })
  .transform(({ order_id }) => ({ orderID: +order_id }));

export const reserveCardParamsSchema = z
  .object({
    order_id: z.string(),
  })
  .transform(({ order_id }) => ({ orderID: +order_id }));

export const unreserveCardParamsSchema = z
  .object({
    order_id: z.string(),
  })
  .transform(({ order_id }) => ({ orderID: +order_id }));

export const giveCardParamsSchema = z
  .object({
    order_id: z.string(),
  })
  .transform(({ order_id }) => ({ orderID: +order_id }));
