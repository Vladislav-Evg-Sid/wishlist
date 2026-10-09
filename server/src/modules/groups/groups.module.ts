import { Module } from "@nestjs/common";

import { GroupsController } from "./groups.controller.js";
import { GROUPS_REPOSITORY, GROUPS_SERVICE } from "./groups.di.js";
import { GroupsService } from "./groups.service.js";
import { GroupsRepository } from "./groups.repository.js";

@Module({
  controllers: [GroupsController],
  providers: [
    { provide: GROUPS_SERVICE, useClass: GroupsService },
    { provide: GROUPS_REPOSITORY, useClass: GroupsRepository },
  ],
})
export class GroupModule {}
