import { Inject, Injectable } from "@nestjs/common";

import {
  SECRET_SANTA_REPOSITORY,
  type SecretSantaRepositoryInterface,
  type SecretSantaServiceInterface,
} from "./secretSanta.di.js";
import type { UUID } from "../../types/shared.js";
import type {
  SecretSantaTeam,
  SecretSantaTeamData,
} from "./secretSanta.types.js";
import { ForbidenError, NotFoundError } from "../../shared/errors.js";
import { db } from "../../db/knex.js";

@Injectable()
export class SecretSantaService implements SecretSantaServiceInterface {
  constructor(
    @Inject(SECRET_SANTA_REPOSITORY)
    private readonly secretSantaRepository: SecretSantaRepositoryInterface,
  ) {}

  private async checkUserIsCreator(userID: UUID, teamID: UUID): Promise<void> {
    const teamInfo = await this.secretSantaRepository.findTeamInfo(teamID);
    if (!teamInfo) {
      throw new NotFoundError("team not found");
    }

    if (teamInfo.creatorID !== userID) {
      throw new ForbidenError("user not a creator");
    }
  }

  async createTeam(userID: UUID, teamData: SecretSantaTeamData): Promise<void> {
    // TODO: добавить проверку на дату (нельзя сделать с датой до текущей)
    // TODO: добавить транзакцию для записи создателя в участники группы

    await db.transaction(async (trx) => {
      const teamID = await this.secretSantaRepository.createTeam(
        userID,
        teamData.teamName,
        teamData.deliveryDate,
        trx,
      );
      await this.secretSantaRepository.addTeamMember(userID, teamID, trx);
    });
  }

  async getUserTeams(userID: UUID): Promise<SecretSantaTeam[]> {
    return this.secretSantaRepository.findUserTeams(userID);
  }

  async updateTeam(
    userID: UUID,
    teamID: UUID,
    teamData: SecretSantaTeamData,
  ): Promise<void> {
    await this.checkUserIsCreator(userID, teamID);

    await this.secretSantaRepository.updateTeamData(
      teamID,
      teamData.teamName,
      teamData.deliveryDate,
    );
  }

  async deleteTeam(userID: UUID, teamID: UUID): Promise<void> {
    await this.checkUserIsCreator(userID, teamID);

    await this.secretSantaRepository.deleteTeam(teamID);
  }
}
