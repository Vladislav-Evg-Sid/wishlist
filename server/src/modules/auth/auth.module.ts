import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { AuthController } from "./auth.controller.js";
import {
  AUTH_BLACKLIST_SERVICE,
  AUTH_REPOSITORY,
  AUTH_SERVICE,
  JWT_REPOSITORY,
  JWT_SERVICE,
} from "./auth.di.js";
import { AuthService } from "./auth.service.js";
import { AuthBlacklistService } from "./auth.blacklist.js";
import { AuthRepository } from "./auth.repository.js";
import { JwtService } from "./jwt.service.js";
import { JwtRepository } from "./jwt.repository.js";
import { AccessTokenGuard } from "./guard/require-access-token.guard.js";

@Module({
  controllers: [AuthController],
  providers: [
    { provide: AUTH_SERVICE, useClass: AuthService },
    { provide: AUTH_BLACKLIST_SERVICE, useClass: AuthBlacklistService },
    { provide: AUTH_REPOSITORY, useClass: AuthRepository },
    { provide: JWT_SERVICE, useClass: JwtService },
    { provide: JWT_REPOSITORY, useClass: JwtRepository },
    { provide: APP_GUARD, useClass: AccessTokenGuard },
  ],
})
export class AuthModule {}
