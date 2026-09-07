import type { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "../modules/auth/jwt.service.js";

export function requireAccessToken(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authorization = req.get("authorization");
  if (!authorization) {
    res.status(401).send("Authorization header is missing");
    return;
  }

  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token) {
    res.status(401).send("Invalid authorization header");
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.sub;

    next();
  } catch {
    res.status(401).send("Invalid or expired access token");
  }
}
