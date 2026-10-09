import {
  Body,
  Controller,
  Inject,
  Post,
  Headers,
  Res,
  Req,
  Get,
} from "@nestjs/common";
import type { Request, Response } from "express";
import type z from "zod";

import { config } from "../../config/env.js";
import { UnauthorizedError } from "../../shared/errors.js";
import { AUTH_SERVICE, type AuthServiceInterface } from "./auth.di.js";
import { Public } from "./decorator/publicEndpoint.decorator.js";
import { createUserBodySchema } from "./auth.schemas.js";
import { CurrentUserID } from "./decorator/currentUserID.decorator.js";
import type { UUID } from "../../types/shared.js";

@Controller()
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: AuthServiceInterface,
  ) {}

  @Public()
  @Post("register")
  async registerUserRequest(
    @Body({ schema: createUserBodySchema })
    userData: z.output<typeof createUserBodySchema>,
    @Headers("user-agent")
    userAgent: string | undefined,
    @Res({ passthrough: true })
    res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.registerUser(
      userData,
      userAgent,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "prod",
      sameSite: "strict",
    });

    return accessToken;
  }

  @Public()
  @Post("login")
  async loginUserRequest(
    @Body({ schema: createUserBodySchema })
    userData: z.output<typeof createUserBodySchema>,
    @Headers("user-agent")
    userAgent: string | undefined,
    @Res({ passthrough: true })
    res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.loginUser(
      userData,
      userAgent,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "prod",
      sameSite: "strict",
    });

    return accessToken;
  }

  @Public()
  @Post("refresh")
  async refreshTokensRequest(
    @Req()
    req: Request,
    @Res({ passthrough: true })
    res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token not found");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshTokens(refreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "strict",
    });

    return accessToken;
  }

  @Public()
  @Post("logout")
  async logoutUserRequest(
    @Req()
    req: Request,
    @Res({ passthrough: true })
    res: Response,
  ): Promise<void> {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await this.authService.logoutUser(refreshToken);
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "strict",
    });

    return;
  }

  @Public()
  @Post("logout/all-sessions")
  async revokeAllUserRefreshRequest(
    @Req()
    req: Request,
    @Res({ passthrough: true })
    res: Response,
  ): Promise<void> {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await this.authService.revokeAllUserRefresh(refreshToken);
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "strict",
    });

    return;
  }

  @Get("me")
  async getUserDataRequest(
    @CurrentUserID()
    userID: UUID,
  ) {
    return await this.authService.getUserData(userID);
  }
}
