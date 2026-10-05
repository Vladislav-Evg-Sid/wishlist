import { z } from "zod";

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
