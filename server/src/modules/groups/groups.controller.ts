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

import { GROUPS_SERVICE, type GroupsServiceInterface } from "./groups.di.js";
import type { UUID } from "../../types/shared.js";
import { CurrentUserID } from "../auth/decorator/currentUserID.decorator.js";
import {
  createGroupBodySchema,
  createInviteLinkQuerySchema,
  getGroupInfoParamsSchema,
  updateGroupNameBodySchema,
} from "./groups.schemas.js";

@Controller("groups")
export class GroupsController {
  constructor(
    @Inject(GROUPS_SERVICE)
    private readonly groupsServece: GroupsServiceInterface,
  ) {}

  @Get()
  async getUserGroups(
    @CurrentUserID()
    userID: UUID,
  ) {
    return await this.groupsServece.getGroupsByUserId(userID);
  }

  @Post()
  async addGroup(
    @Body({ schema: createGroupBodySchema })
    groupData: z.output<typeof createGroupBodySchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    await this.groupsServece.addGroup(userID, groupData);
    return "Successfully created";
  }

  @Get("invite")
  async createInviteLink(
    @Query({ schema: createInviteLinkQuerySchema })
    query: z.output<typeof createInviteLinkQuerySchema>,
  ) {
    return `Какой-то код для ttl = ${query.ttl} и количества приглашений = ${query.limitMembers}`;
  }

  @Get(":group_id")
  async getGroupInfo(
    @Param({ schema: getGroupInfoParamsSchema })
    params: z.output<typeof getGroupInfoParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    const { title, isCreator } = await this.groupsServece.getGroupInfo(
      userID,
      params.groupID,
    );

    return { title, is_creator: isCreator };
  }

  @Get(":group_id/users")
  async getGroupUsers(
    @Param({ schema: getGroupInfoParamsSchema })
    params: z.output<typeof getGroupInfoParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    return await this.groupsServece.getGroupUsers(userID, params.groupID);
  }

  @Put(":group_id")
  async updateGroupName(
    @Param({ schema: getGroupInfoParamsSchema })
    params: z.output<typeof getGroupInfoParamsSchema>,
    @Body({ schema: updateGroupNameBodySchema })
    groupName: z.output<typeof updateGroupNameBodySchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    await this.groupsServece.updateGroupName(
      userID,
      params.groupID,
      groupName.title,
    );
  }

  @Delete(":group_id")
  async deleteGroup(
    @Param({ schema: getGroupInfoParamsSchema })
    params: z.output<typeof getGroupInfoParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    await this.groupsServece.deleteGroup(userID, params.groupID);
  }
}
