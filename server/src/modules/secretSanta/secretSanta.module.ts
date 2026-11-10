import { Module } from "@nestjs/common";
import {
  SecretSantaController,
  SecretSantaTeamController,
} from "./secretSanta.controller.js";
import {
  SECRET_SANTA_REPOSITORY,
  SECRET_SANTA_SERVICE,
} from "./secretSanta.di.js";
import { SecretSantaService } from "./secretSanta.service.js";
import { SecretSantaRepository } from "./secretSanta.repository.js";

@Module({
  controllers: [SecretSantaController, SecretSantaTeamController],
  providers: [
    { provide: SECRET_SANTA_SERVICE, useClass: SecretSantaService },
    { provide: SECRET_SANTA_REPOSITORY, useClass: SecretSantaRepository },
  ],
})
export class SecretSantaModule {}
