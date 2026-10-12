import { Inject, Injectable } from "@nestjs/common";

import { checkGroupUserAccess } from "../../shared/checkUserGroup.js";
import { ForbidenError } from "../../shared/errors.js";
import type { UUID } from "../../types/shared.js";
import type {
  CreateGroup,
  GroupData,
  GroupInfo,
  GroupUsersList,
} from "./groups.types.js";
import {
  GROUPS_REPOSITORY,
  type GroupsRepositoryInterface,
  type GroupsServiceInterface,
} from "./groups.di.js";

@Injectable()
export class GroupsService implements GroupsServiceInterface {
  constructor(
    @Inject(GROUPS_REPOSITORY)
    private readonly groupsRepository: GroupsRepositoryInterface,
  ) {}

  async getGroupsByUserId(userID: UUID): Promise<GroupData[]> {
    return this.groupsRepository.findGroupsByUserId(userID);
  }

  async addGroup(userID: UUID, groupData: CreateGroup): Promise<void> {
    const groupName = groupData.groupName;
    await this.groupsRepository.createGroup(userID, groupName);
  }

  async getGroupInfo(userID: UUID, groupID: UUID): Promise<GroupInfo> {
    const userAccess = await checkGroupUserAccess(userID, groupID);
    if (!userAccess) {
      throw new ForbidenError("User not a member or creator");
    }
    const { title, creatorID } =
      await this.groupsRepository.findGroupInfo(groupID);

    return {
      title,
      isCreator: creatorID === userID,
    };
  }

  async getGroupUsers(userID: UUID, groupID: UUID): Promise<GroupUsersList> {
    const userAccess = await checkGroupUserAccess(userID, groupID);
    if (!userAccess) {
      throw new ForbidenError("User not a member or creator");
    }
    const creator = await this.groupsRepository.findGroupCreator(groupID);
    if (!creator) {
      throw new ForbidenError("Group's creator not found");
    }
    const members = await this.groupsRepository.findGroupMembers(groupID);
    const filteredMembers = members.filter(
      ({ name, hash }) => name !== null && hash != null,
    );

    return {
      creator,
      members: filteredMembers,
    };
  }
}
