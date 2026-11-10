import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import type z from "zod";

import { CurrentUserID } from "../auth/decorator/currentUserID.decorator.js";
import {
  addTeamMemberByCodeParamsSchema,
  createInviteLinkQuerySchema,
  createTeamBodySchema,
  deleteTeamParamsSchema,
  remooveMemberBodySchema,
  teamRoutsParamsSchema,
  updateTeamBodySchema,
  updateTeamParamsSchema,
} from "./secretSanta.schemas.js";
import type { UUID } from "../../types/shared.js";
import { logger } from "../../config/logger.js";
import {
  SECRET_SANTA_SERVICE,
  type SecretSantaServiceInterface,
  type SecretSantaTeamServiceInterface,
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

@Controller("secret-santa/teams")
export class SecretSantaTeamController {
  constructor(
    @Inject(SECRET_SANTA_SERVICE)
    private readonly secretSantaService: SecretSantaTeamServiceInterface,
  ) {}

  @Get("details/:team_id")
  async getTeamDetails(
    @Param({ schema: teamRoutsParamsSchema })
    params: z.output<typeof teamRoutsParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    return await this.secretSantaService.getTeamDetails(userID, params.teamID);
  }

  @Get("wishes/:team_id")
  async getUserWishesInTeam(
    @Param({ schema: teamRoutsParamsSchema })
    params: z.output<typeof teamRoutsParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    return await this.secretSantaService.getUserWishesInTeam(
      userID,
      params.teamID,
    );
  }

  @Post("draw/:team_id")
  async drawTeamMembers(
    @Param({ schema: teamRoutsParamsSchema })
    params: z.output<typeof teamRoutsParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    return await this.secretSantaService.drawTeamMembers(userID, params.teamID);
  }

  @Post("preparing-gift/:team_id")
  async preparingGiftOnTeam(
    @Param({ schema: teamRoutsParamsSchema })
    params: z.output<typeof teamRoutsParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    return await this.secretSantaService.preparingGiftOnTeam(
      userID,
      params.teamID,
    );
  }

  @Delete("member")
  async remooveMember(
    @Body({ schema: remooveMemberBodySchema })
    remooveData: z.output<typeof remooveMemberBodySchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    await this.secretSantaService.remooveMember(
      userID,
      remooveData.teamID,
      remooveData.memberID,
    );
  }

  @Get(":team_id/invite")
  async createInviteLink(
    @Query({ schema: createInviteLinkQuerySchema })
    query: z.output<typeof createInviteLinkQuerySchema>,
    @Param({ schema: teamRoutsParamsSchema })
    params: z.output<typeof teamRoutsParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    return this.secretSantaService.createInviteCode(
      userID,
      params.teamID,
      query.ttl,
      query.limitMembers,
    );
  }

  @Post("invite/:code")
  async addTeamMemberByCode(
    @Param({ schema: addTeamMemberByCodeParamsSchema })
    params: z.output<typeof addTeamMemberByCodeParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    const groupID = await this.secretSantaService.addMemberByInviteCode(
      userID,
      params.code,
    );
    return { group_id: groupID };
  }
}
