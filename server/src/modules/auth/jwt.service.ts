import { Injectable } from "@nestjs/common";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import { config } from "../../config/env.js";
import type { AccessTokenPayload, RefreshTokenPayload } from "./auth.types.js";
import type { UUID } from "../../types/shared.js";
import { UnauthorizedError } from "../../shared/errors.js";
import type { TokenData } from "./jwt.types.js";
import type {
  JwtServiceForVerifAccess,
  JwtServiceInterface,
} from "./auth.di.js";

@Injectable()
export class JwtService
  implements JwtServiceInterface, JwtServiceForVerifAccess
{
  createAccessToken(userID: UUID): string {
    return jwt.sign(
      {
        type: "access",
      },
      config.jwt.accessSecret,
      {
        subject: userID,
        expiresIn: config.jwt.accessTTL,
      },
    );
  }

  createRefreshToken(userID: UUID): TokenData {
    const jti = crypto.randomUUID();

    const token = jwt.sign(
      {
        type: "refresh",
      },
      config.jwt.refreshSecret,
      {
        subject: userID,
        jwtid: jti,
        expiresIn: config.jwt.refreshTTL,
      },
    );

    return { token, jti };
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    const payload = jwt.verify(token, config.jwt.accessSecret);

    if (typeof payload === "string") {
      throw new UnauthorizedError("Invalid access token payload");
    }

    if (payload.type !== "access" || typeof payload.sub !== "string") {
      throw new UnauthorizedError("Invalid access token");
    }

    return payload as AccessTokenPayload;
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    const payload = jwt.verify(token, config.jwt.refreshSecret);

    if (typeof payload === "string") {
      throw new UnauthorizedError("Invalid refresh token payload");
    }

    if (
      payload.type !== "refresh" ||
      typeof payload.sub !== "string" ||
      typeof payload.jti !== "string" ||
      typeof payload.exp !== "number"
    ) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    return payload as RefreshTokenPayload;
  }
}
