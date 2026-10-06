export class ApiError extends Error {
  public readonly statusCode;
  public readonly code;
  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
  }
}
