import type { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger.js";

export function loggerMidleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.info(
    { method: req.method, url: req.url },
    `${req.method}: ${req.url}`,
  );

  next();
}
