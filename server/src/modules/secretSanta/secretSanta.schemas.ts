import z from "zod";
import { UUIDSchema } from "../../shared/zodUUID.js";

export const createTeamBodySchema = z
  .object({
    team_name: z.string(),
    delivery_date: z.coerce.date(),
  })
  .transform(({ team_name, delivery_date }) => ({
    teamName: team_name,
    deliveryDate: delivery_date,
  }));

export const updateTeamParamsSchema = z
  .object({
    team_id: UUIDSchema,
  })
  .transform(({ team_id }) => ({ teamID: team_id }));

export const updateTeamBodySchema = z
  .object({
    team_name: z.string(),
    delivery_date: z.coerce.date(),
  })
  .transform(({ team_name, delivery_date }) => ({
    teamName: team_name,
    deliveryDate: delivery_date,
  }));

export const deleteTeamParamsSchema = z
  .object({
    team_id: UUIDSchema,
  })
  .transform(({ team_id }) => ({ teamID: team_id }));

export const teamRoutsParamsSchema = z
  .object({
    team_id: UUIDSchema,
  })
  .transform(({ team_id }) => ({ teamID: team_id }));

export const remooveMemberBodySchema = z
  .object({ team_id: UUIDSchema, member_id: UUIDSchema })
  .transform(({ team_id, member_id }) => ({
    teamID: team_id,
    memberID: member_id,
  }));

export const createInviteLinkQuerySchema = z
  .object({
    ttl: z.coerce.number().int().positive().nullable().default(null),
    limit_members: z.coerce.number().int().positive().nullable().default(null),
  })
  .transform(({ ttl, limit_members }) => ({
    ttl,
    limitMembers: limit_members,
  }));

export const addTeamMemberByCodeParamsSchema = z.object({ code: z.string() });
