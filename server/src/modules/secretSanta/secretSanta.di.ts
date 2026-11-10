import type { Knex } from "knex";

import type { UUID } from "../../types/shared.js";
import type {
  SecretSantaTeam,
  SecretSantaTeamData,
  SecretSantaTeamDetails,
  SecretSantaTeamInfo,
  SecretSantaWish,
} from "./secretSanta.types.js";

export const SECRET_SANTA_REPOSITORY = Symbol("SECRET_SANTA_REPOSITORY");

export interface SecretSantaRepositoryInterface {
  createTeam(
    creatorID: UUID,
    teamName: string,
    deliveryDate: Date,
    connection?: Knex | Knex.Transaction,
  ): Promise<UUID>;
  findUserTeams(
    userID: UUID,
    connection?: Knex | Knex.Transaction,
  ): Promise<SecretSantaTeam[]>;
  findTeamInfo(
    teamID: UUID,
    connection?: Knex | Knex.Transaction,
  ): Promise<SecretSantaTeamInfo | null>;
  updateTeamData(
    teamID: UUID,
    teamName: string,
    deliveryDate: Date,
    connection?: Knex | Knex.Transaction,
  ): Promise<void>;
  deleteTeam(teamID: UUID, connection?: Knex | Knex.Transaction): Promise<void>;
  addTeamMember(
    memberID: UUID,
    teamID: UUID,
    connection?: Knex | Knex.Transaction,
  ): Promise<void>;
}

export const SECRET_SANTA_SERVICE = Symbol("SECRET_SANTA_SERVICE");

export interface SecretSantaServiceInterface {
  createTeam(userID: UUID, teamData: SecretSantaTeamData): Promise<void>;
  getUserTeams(userID: UUID): Promise<SecretSantaTeam[]>;
  updateTeam(
    userID: UUID,
    teamID: UUID,
    teamData: SecretSantaTeamData,
  ): Promise<void>;
  deleteTeam(userID: UUID, teamID: UUID): Promise<void>;
}

// TODO: добавить в сервис и тесты
export interface SecretSantaTeamServiceInterface {
  getTeamDetails(userID: UUID, teamID: UUID): Promise<SecretSantaTeamDetails>;
  getUserWishesInTeam(userID: UUID, teamID: UUID): Promise<SecretSantaWish[]>;
  drawTeamMembers(userID: UUID, teamID: UUID): Promise<void>;
  preparingGiftOnTeam(userID: UUID, teamID: UUID): Promise<void>;
  remooveMember(userID: UUID, teamID: UUID, memberID: UUID): Promise<void>;
  createInviteCode(
    userID: UUID,
    teamID: UUID,
    ttl: number | null,
    limitMembers: number | null,
  ): Promise<string>;
  addMemberByInviteCode(userID: UUID, code: string): Promise<UUID>;
}
