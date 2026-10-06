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

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, "NOT_FOUND");
  }
}

export class ForbidenError extends AppError {
  constructor(message: string) {
    super(message, 403, "FORBIDEN");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401, "UNAUTHORIZED");
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
