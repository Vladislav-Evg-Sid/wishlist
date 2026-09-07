import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import { config } from "../../config/env.js";
import type { AccessTokenPayload, RefreshTokenPayload } from "./auth.types.js";

export function createAccessToken(userId: string) {
  return jwt.sign(
    {
      type: "access",
    },
    config.jwt.accessSecret,
    {
      subject: userId,
      expiresIn: config.jwt.accessTTL,
    },
  );
}

export function createRefreshToken(userId: string) {
  const jti = crypto.randomUUID();

  const token = jwt.sign(
    {
      type: "refresh",
    },
    config.jwt.refreshSecret,
    {
      subject: userId,
      jwtid: jti,
      expiresIn: config.jwt.refreshTTL,
    },
  );

  return { token, jti };
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = jwt.verify(token, config.jwt.accessSecret);

  if (typeof payload === "string") {
    throw new Error("Invalid access token payload");
  }

  if (payload.type !== "access" || typeof payload.sub !== "string") {
    throw new Error("Invalid access token");
  }

  return payload as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const payload = jwt.verify(token, config.jwt.refreshSecret);

  if (typeof payload === "string") {
    throw new Error("Invalid refresh token payload");
  }

  if (
    payload.type !== "refresh" ||
    typeof payload.sub !== "string" ||
    typeof payload.jti !== "string" ||
    typeof payload.exp !== "number"
  ) {
    throw new Error("Invalid refresh token");
  }

  return payload as RefreshTokenPayload;
}
