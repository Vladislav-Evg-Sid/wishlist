import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export function validateBody(bodySchema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = bodySchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Invalid request body",
        errors: result.error.issues,
      });
      return;
    }
    res.locals.validateBody = result.data;
    next();
  };
}

export function validateParams(paramsSchema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = paramsSchema.safeParse(req.params);

    if (!result.success) {
      res.status(400).json({
        message: "Invalid request path params",
        errors: result.error.issues,
      });
      return;
    }
    res.locals.validateParams = result.data;
    next();
  };
}

export function validateQuery(querySchema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = querySchema.safeParse(req.query);

    if (!result.success) {
      res.status(400).json({
        message: "Invalid request query params",
        errors: result.error.issues,
      });
      return;
    }
    res.locals.validateQuery = result.data;
    next();
  };
}
