import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import type z from "zod";

import { CurrentUserID } from "../auth/decorator/currentUserID.decorator.js";
import {
  createTeamBodySchema,
  deleteTeamParamsSchema,
  getUserTeamsParamsSchema,
  updateTeamBodySchema,
  updateTeamParamsSchema,
} from "./secretSanta.schemas.js";
import type { UUID } from "../../types/shared.js";
import { logger } from "../../config/logger.js";

@Controller("secret-santa")
export class SecretSantaController {
  constructor() {}

  @Post()
  async createTeam(
    @Body({ schema: createTeamBodySchema })
    teamData: z.output<typeof createTeamBodySchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    logger.info({ title: "Создание группы", userID, teamData });
  }

  @Get(":team_id")
  async getUserTeams(
    @Param({ schema: getUserTeamsParamsSchema })
    params: z.output<typeof getUserTeamsParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    logger.info({
      title: "Получение всех групп пользователя",
      userID,
      teamID: params.teamID,
    });
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
  }
}
