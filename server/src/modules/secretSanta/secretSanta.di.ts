import type { UUID } from "../../types/shared.js";
import type {
  SecretSantaTeam,
  SecretSantaTeamData,
} from "./secretSanta.types.js";

export const SECRET_SANTA_REPOSITORY = Symbol("SECRET_SANTA_REPOSITORY");

export interface SecretSantaRepositoryInterface {}

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
