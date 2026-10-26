import z from "zod";
import { UUIDSchema } from "../../shared/zodUUID.js";

export const createTeamBodySchema = z
  .object({
    team_name: z.string(),
    delivery_date: z.coerce.date(),
  })
  .transform((team_name, delivery_date) => ({
    teamName: team_name,
    deliveryDate: delivery_date,
  }));

export const getUserTeamsParamsSchema = z
  .object({
    team_id: UUIDSchema,
  })
  .transform((team_id) => ({ teamID: team_id }));

export const updateTeamParamsSchema = z
  .object({
    team_id: UUIDSchema,
  })
  .transform((team_id) => ({ teamID: team_id }));

export const updateTeamBodySchema = z
  .object({
    team_name: z.string(),
    delivery_date: z.coerce.date(),
  })
  .transform((team_name, delivery_date) => ({
    teamName: team_name,
    deliveryDate: delivery_date,
  }));

export const deleteTeamParamsSchema = z
  .object({
    team_id: UUIDSchema,
  })
  .transform((team_id) => ({ teamID: team_id }));
