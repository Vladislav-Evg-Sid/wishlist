import type { NextFunction, Request, Response } from "express";

import { AppError } from "../shared/errors.js";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      code: error.code,
      message: error.message,
    });
    return;
  }

  res.status(500).json({
    code: "INTERNAL_ERROR",
    message: "Internal server error",
  });
}
