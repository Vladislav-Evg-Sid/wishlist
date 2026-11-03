import { Inject, Injectable } from "@nestjs/common";

import {
  SECRET_SANTA_REPOSITORY,
  type SecretSantaRepositoryInterface,
  type SecretSantaServiceInterface,
} from "./secretSanta.di.js";

@Injectable()
export class SecretSantaService implements SecretSantaServiceInterface {
  constructor(
    @Inject(SECRET_SANTA_REPOSITORY)
    private readonly secretSantaRepository: SecretSantaRepositoryInterface,
  ) {}
}
