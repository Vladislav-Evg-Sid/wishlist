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
