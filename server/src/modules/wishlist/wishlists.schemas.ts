import z from "zod";
import { UUIDSchema } from "../../shared/zodUUID.js";

export const getGroupWishlistsParamsSchema = z
  .object({
    group_id: UUIDSchema,
  })
  .transform((data) => ({ groupID: data.group_id }));

export const createWishlistBodySchema = z
  .object({
    group_id: UUIDSchema,
    title: z.string(),
  })
  .transform((data) => ({
    groupID: data.group_id,
    title: data.title,
  }));

export const getWishlistInfoParamsSchema = z
  .object({
    wishlist_id: UUIDSchema,
  })
  .transform(({ wishlist_id }) => ({ wishlistID: wishlist_id }));

export const deleteWishlistParamsSchema = z
  .object({
    wishlist_id: UUIDSchema,
  })
  .transform(({ wishlist_id }) => ({ wishlistID: wishlist_id }));

export const updateWishlistNameParamsSchema = z
  .object({
    wishlist_id: UUIDSchema,
  })
  .transform(({ wishlist_id }) => ({ wishlistID: wishlist_id }));

export const updateWishlistNameBody = z.object({ title: z.string() });
