import type { NextFunction, Request, Response } from "express";

import { AppError } from "../shared/errors.js";
import { logger } from "../config/logger.js";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof AppError) {
    logger.warn(
      {
        errorCode: error.code,
        message: error.message,
        method: req.method,
        url: req.url,
      },
      `${error.code}: ${error.message}`,
    );
    res.status(error.statusCode).json({
      code: error.code,
      message: error.message,
    });
    return;
  }

  logger.error(
    {
      error: error,
      method: req.method,
      url: req.url,
    },
    "Unknown error",
  );

  res.status(500).json({
    code: "INTERNAL_ERROR",
    message: "Internal server error",
  });
}
