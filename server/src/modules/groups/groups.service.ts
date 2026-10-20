import { Inject, Injectable } from "@nestjs/common";
import crypto from "node:crypto";

import { checkGroupUserAccess } from "../../shared/checkUserGroup.js";
import {
  DataConflictError,
  ForbidenError,
  InternalServerError,
  NotFoundError,
} from "../../shared/errors.js";
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
import {
  REDIS_SERVICE,
  type redisServiceInviteInterface,
} from "../../infrastructure/redis/redis.di.js";

@Injectable()
export class GroupsService implements GroupsServiceInterface {
  private readonly alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  private readonly redisPrrefix = "ic";

  constructor(
    @Inject(GROUPS_REPOSITORY)
    private readonly groupsRepository: GroupsRepositoryInterface,
    @Inject(REDIS_SERVICE)
    private readonly redisService: redisServiceInviteInterface,
  ) {}

  private getNewCode(length: number = 6): string {
    let code = "";

    for (let i = 0; i < length; i++) {
      const index = crypto.randomInt(0, this.alphabet.length);
      code += this.alphabet[index];
    }

    return code;
  }

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
      throw new NotFoundError("Group's creator not found");
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

  async updateGroupName(
    userID: UUID,
    groupID: UUID,
    newName: string,
  ): Promise<void> {
    const { creatorID } = await this.groupsRepository.findGroupInfo(groupID);
    if (creatorID !== userID) {
      throw new ForbidenError("user not a creator");
    }

    await this.groupsRepository.updateGroupName(groupID, newName);
  }

  async deleteGroup(userID: UUID, groupID: UUID): Promise<void> {
    const { creatorID } = await this.groupsRepository.findGroupInfo(groupID);
    if (!creatorID) {
      throw new NotFoundError("group not found");
    }
    if (creatorID !== userID) {
      throw new ForbidenError("user not a creator");
    }

    await this.groupsRepository.deleteGroup(groupID);
  }

  async createInviteCode(
    userID: UUID,
    groupID: UUID,
    ttl: number | null,
    limitMembers: number | null,
  ): Promise<string> {
    const { creatorID } = await this.groupsRepository.findGroupInfo(groupID);
    if (creatorID !== userID) {
      throw new ForbidenError("user not a creator");
    }

    if (!ttl && !limitMembers) {
      throw new DataConflictError("ttl or limitMembers could exist");
    }

    for (let attempt = 0; attempt < 10; attempt++) {
      const code = this.getNewCode();
      const isCreated = await this.redisService.setHashCounterValue(
        this.redisPrrefix,
        code,
        "groupID",
        groupID,
        "remaining",
        limitMembers ?? -1,
        ttl ? ttl * 60 * 60 : undefined,
      );
      if (isCreated) {
        return code;
      }
    }

    throw new InternalServerError("Failed to generate unique invite code");
  }
}
