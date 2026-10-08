export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export interface ValidationIssue {
  message: string;
  path?: string;
}

export class ValidationError extends AppError {
  constructor(public readonly errors: ValidationIssue[]) {
    super("Invalid request data", 400, "VALIDATION_ERROR");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbidenError extends AppError {
  constructor(message: string) {
    super(message, 403, "FORBIDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, "NOT_FOUND");
  }
}

export class DataConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT");
  }
}

export class InternalServerError extends AppError {
  constructor(message: string) {
    super(message, 500, "INTERNAL_ERROR");
  }
}
