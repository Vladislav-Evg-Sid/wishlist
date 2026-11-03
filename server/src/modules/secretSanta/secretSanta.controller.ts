import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import type z from "zod";

import { CurrentUserID } from "../auth/decorator/currentUserID.decorator.js";
import {
  createTeamBodySchema,
  deleteTeamParamsSchema,
  updateTeamBodySchema,
  updateTeamParamsSchema,
} from "./secretSanta.schemas.js";
import type { UUID } from "../../types/shared.js";
import { logger } from "../../config/logger.js";
import {
  SECRET_SANTA_SERVICE,
  type SecretSantaServiceInterface,
} from "./secretSanta.di.js";

@Controller("secret-santa")
export class SecretSantaController {
  constructor(
    @Inject(SECRET_SANTA_SERVICE)
    private readonly secretSantaService: SecretSantaServiceInterface,
  ) {}

  @Post()
  async createTeam(
    @Body({ schema: createTeamBodySchema })
    teamData: z.output<typeof createTeamBodySchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    logger.info({ title: "Создание группы", userID, teamData });
    await this.secretSantaService.createTeam(userID, teamData);
  }

  @Get()
  async getUserTeams(
    @CurrentUserID()
    userID: UUID,
  ) {
    logger.info({
      title: "Получение всех групп пользователя",
      userID,
    });
    return this.secretSantaService.getUserTeams(userID);
  }

  @Put(":team_id")
  async updateTeam(
    @Param({ schema: updateTeamParamsSchema })
    params: z.output<typeof updateTeamParamsSchema>,
    @Body({ schema: updateTeamBodySchema })
    teamData: z.output<typeof updateTeamBodySchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    logger.info({
      title: "Обновление группы",
      userID,
      teamID: params.teamID,
      teamData,
    });
    await this.secretSantaService.updateTeam(userID, params.teamID, teamData);
  }

  @Delete(":team_id")
  async deleteTeam(
    @Param({ schema: deleteTeamParamsSchema })
    params: z.output<typeof deleteTeamParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    logger.info({
      title: "Удаление команды",
      userID,
      teamID: params.teamID,
    });
    await this.secretSantaService.deleteTeam(userID, params.teamID);
  }
}
