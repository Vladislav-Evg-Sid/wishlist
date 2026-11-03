import { Injectable } from "@nestjs/common";

import type { SecretSantaRepositoryInterface } from "./secretSanta.di.js";

@Injectable()
export class SecretSantaRepository implements SecretSantaRepositoryInterface {}
