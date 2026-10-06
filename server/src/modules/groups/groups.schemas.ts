import z from "zod";
import { UUIDSchema } from "../../shared/zodUUID.js";

export const createGroupBodySchema = z
  .object({
    group_name: z.string(),
  })
  .transform((data) => ({ groupName: data.group_name }));

export const getGroupInfoParamsSchema = z
  .object({
    group_id: UUIDSchema,
  })
  .transform((data) => ({ groupID: data.group_id }));
