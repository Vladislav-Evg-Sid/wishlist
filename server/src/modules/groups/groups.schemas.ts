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

export const updateGroupNameBodySchema = z.object({
  title: z.string(),
});

export const createInviteLinkQuerySchema = z
  .object({
    ttl: z.coerce.number().int().positive().nullable().default(null),
    limit_members: z.coerce.number().int().positive().nullable().default(null),
  })
  .transform(({ ttl, limit_members }) => ({
    ttl,
    limitMembers: limit_members,
  }));
