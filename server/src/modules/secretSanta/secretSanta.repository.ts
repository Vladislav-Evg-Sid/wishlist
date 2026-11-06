import { Injectable } from "@nestjs/common";
import type { Knex } from "knex";

import type { SecretSantaRepositoryInterface } from "./secretSanta.di.js";
import type { UUID } from "../../types/shared.js";
import type {
  SecretSantaTeam,
  SecretSantaTeamInfo,
} from "./secretSanta.types.js";
import {
  SS_MEMBERS_COLUMNS,
  SS_TEAM_COLUMNS,
  TABLES,
} from "../../db/schema.js";
import { db } from "../../db/knex.js";
import { concatTableAndColumn } from "../../shared/dbUtils.js";

@Injectable()
export class SecretSantaRepository implements SecretSantaRepositoryInterface {
  async createTeam(
    creatorID: UUID,
    teamName: string,
    deliveryDate: Date,
    connection: Knex | Knex.Transaction = db,
  ): Promise<UUID> {
    const teamID = await connection(TABLES.secret_santa_team)
      .insert({
        [SS_TEAM_COLUMNS.title]: teamName,
        [SS_TEAM_COLUMNS.delivery_date]: deliveryDate,
        [SS_TEAM_COLUMNS.creator_id]: creatorID,
      })
      .returning(SS_TEAM_COLUMNS.id);

    return teamID[0][SS_TEAM_COLUMNS.id] as UUID;
  }

  async findUserTeams(
    userID: UUID,
    connection: Knex | Knex.Transaction = db,
  ): Promise<SecretSantaTeam[]> {
    type SecretSantaTeamRaw = Omit<SecretSantaTeam, "membersCount"> & {
      membersCount: string | number;
    };
    const allMemberTable = "all_members";

    const teamData = await connection<any, SecretSantaTeamRaw[]>(
      TABLES.secret_santa_team,
    )
      .join(
        TABLES.secret_santa_members,
        concatTableAndColumn(TABLES.secret_santa_team, SS_TEAM_COLUMNS.id),
        concatTableAndColumn(
          TABLES.secret_santa_members,
          SS_MEMBERS_COLUMNS.team_id,
        ),
      )
      .join(
        `${TABLES.secret_santa_members} as ${allMemberTable}`,
        concatTableAndColumn(TABLES.secret_santa_team, SS_TEAM_COLUMNS.id),
        concatTableAndColumn(allMemberTable, SS_MEMBERS_COLUMNS.team_id),
      )
      .select({
        id: concatTableAndColumn(TABLES.secret_santa_team, SS_TEAM_COLUMNS.id),
        title: SS_TEAM_COLUMNS.title,
        createdDate: SS_TEAM_COLUMNS.created_at,
        deliveryDate: SS_TEAM_COLUMNS.delivery_date,
        stage: SS_TEAM_COLUMNS.stage,
      })
      .count<{ membersCount: string | number }, SecretSantaTeamRaw[]>({
        membersCount: concatTableAndColumn(
          allMemberTable,
          SS_MEMBERS_COLUMNS.member_id,
        ),
      })
      .where(
        concatTableAndColumn(
          TABLES.secret_santa_members,
          SS_MEMBERS_COLUMNS.member_id,
        ),
        userID,
      )
      .groupBy(
        concatTableAndColumn(TABLES.secret_santa_team, SS_TEAM_COLUMNS.id),
      );

    return teamData.map((team) => ({
      ...team,
      membersCount: Number(team.membersCount),
    }));
  }

  async findTeamInfo(
    teamID: UUID,
    connection: Knex | Knex.Transaction = db,
  ): Promise<SecretSantaTeamInfo | null> {
    const teamInfo = await connection(TABLES.secret_santa_team)
      .select({
        id: SS_TEAM_COLUMNS.id,
        name: SS_TEAM_COLUMNS.title,
        deliveryDate: SS_TEAM_COLUMNS.delivery_date,
        creatorID: SS_TEAM_COLUMNS.creator_id,
      })
      .where(SS_TEAM_COLUMNS.id, teamID)
      .first();

    return teamInfo ?? null;
  }

  async updateTeamData(
    teamID: UUID,
    teamName: string,
    deliveryDate: Date,
    connection: Knex | Knex.Transaction = db,
  ): Promise<void> {
    await connection(TABLES.secret_santa_team)
      .update({
        [SS_TEAM_COLUMNS.title]: teamName,
        [SS_TEAM_COLUMNS.delivery_date]: deliveryDate,
      })
      .where(SS_TEAM_COLUMNS.id, teamID);
  }

  async deleteTeam(
    teamID: UUID,
    connection: Knex | Knex.Transaction = db,
  ): Promise<void> {
    await connection(TABLES.secret_santa_team)
      .delete()
      .where(SS_TEAM_COLUMNS.id, teamID);
  }

  async addTeamMember(
    memberID: UUID,
    teamID: UUID,
    connection: Knex | Knex.Transaction = db,
  ): Promise<void> {
    await connection(TABLES.secret_santa_members).insert({
      [SS_MEMBERS_COLUMNS.member_id]: memberID,
      [SS_MEMBERS_COLUMNS.team_id]: teamID,
    });
  }
}
