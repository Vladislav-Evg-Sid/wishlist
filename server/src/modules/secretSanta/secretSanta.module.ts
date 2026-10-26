import { Module } from "@nestjs/common";
import { SecretSantaController } from "./secretSanta.controller.js";

@Module({
  controllers: [SecretSantaController],
})
export class SecretSantaModule {}
