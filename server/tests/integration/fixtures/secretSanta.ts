import { db } from "../../../src/db/knex.js";
import { SS_MEMBERS_COLUMNS, SS_TEAM_COLUMNS, TABLES } from "../../../src/db/schema.js";
import type { UUID } from "../../../src/types/shared.js";
import { createUser } from "./users.js";

export async function createTeamWithCreatorID(creatorID: UUID): Promise<UUID> {
  const [team] = await db(TABLES.secret_santa_team)
    .insert({
      [SS_TEAM_COLUMNS.title]: "Название команды",
      [SS_TEAM_COLUMNS.creator_id]: creatorID,
      [SS_TEAM_COLUMNS.delivery_date]: "2026-12-31",
    })
    .returning(SS_TEAM_COLUMNS.id);
  return team[SS_TEAM_COLUMNS.id];
}

export async function createTeam(): Promise<{ creatorID: UUID; teamID: UUID }> {
  const creatorID = await createUser();
  const teamID = await createTeamWithCreatorID(creatorID);
  return { creatorID, teamID };
}

export async function addTeamMember(memberID: UUID, teamID: UUID): Promise<void> {
  await db(TABLES.secret_santa_members).insert({
    [SS_MEMBERS_COLUMNS.member_id]: memberID,
    [SS_MEMBERS_COLUMNS.team_id]: teamID,
  });
}
