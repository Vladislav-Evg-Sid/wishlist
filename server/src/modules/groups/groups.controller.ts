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
  addGroupMemberByCodeParamsSchema,
  changeCreatorParamsSchema,
  createGroupBodySchema,
  createInviteLinkParamsSchema,
  createInviteLinkQuerySchema,
  deleteMemberParamsSchema,
  getGroupInfoParamsSchema,
  updateGroupNameBodySchema,
} from "./groups.schemas.js";

@Controller("groups")
export class GroupsController {
  constructor(
    @Inject(GROUPS_SERVICE)
    private readonly groupsService: GroupsServiceInterface,
  ) {}

  @Get()
  async getUserGroups(
    @CurrentUserID()
    userID: UUID,
  ) {
    return await this.groupsService.getGroupsByUserId(userID);
  }

  @Post()
  async addGroup(
    @Body({ schema: createGroupBodySchema })
    groupData: z.output<typeof createGroupBodySchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    await this.groupsService.addGroup(userID, groupData);
    return "Successfully created";
  }

  @Post("invite/:code")
  async addGroupMemberByCode(
    @Param({ schema: addGroupMemberByCodeParamsSchema })
    params: z.output<typeof addGroupMemberByCodeParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    const groupID = await this.groupsService.addMemberByInviteCode(
      userID,
      params.code,
    );
    return { group_id: groupID };
  }

  @Get(":group_id")
  async getGroupInfo(
    @Param({ schema: getGroupInfoParamsSchema })
    params: z.output<typeof getGroupInfoParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    const { title, isCreator } = await this.groupsService.getGroupInfo(
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
    return await this.groupsService.getGroupUsers(userID, params.groupID);
  }

  @Put(":group_id/:member_id")
  async changeCreator(
    @Param({ schema: changeCreatorParamsSchema })
    params: z.output<typeof changeCreatorParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    await this.groupsService.changeCreator(
      userID,
      params.groupID,
      params.newCreatorID,
    );
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
    await this.groupsService.updateGroupName(
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
    await this.groupsService.deleteGroup(userID, params.groupID);
  }

  @Delete(":group_id/:member_id")
  async deleteMember(
    @Param({ schema: deleteMemberParamsSchema })
    params: z.output<typeof deleteMemberParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    await this.groupsService.deleteMember(
      userID,
      params.groupID,
      params.memberID,
    );
  }

  @Get(":group_id/invite")
  async createInviteLink(
    @Query({ schema: createInviteLinkQuerySchema })
    query: z.output<typeof createInviteLinkQuerySchema>,
    @Param({ schema: createInviteLinkParamsSchema })
    params: z.output<typeof createInviteLinkParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    return this.groupsService.createInviteCode(
      userID,
      params.groupID,
      query.ttl,
      query.limitMembers,
    );
  }
}
