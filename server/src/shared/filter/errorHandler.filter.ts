import { HttpAdapterHost } from "@nestjs/core";
import {
  type ArgumentsHost,
  type ExceptionFilter,
  Catch,
} from "@nestjs/common";

import { AppError } from "../errors.js";

@Catch()
export class AppErrorFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(error: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const request = host.switchToHttp().getRequest();
    const response = host.switchToHttp().getResponse();

    if (error instanceof AppError) {
      request.log.warn(
        {
          errorCode: error.code,
          message: error.message,
        },
        `${error.code}: ${error.message}`,
      );

      httpAdapter.reply(
        response,
        {
          code: error.code,
          message: error.message,
        },
        error.statusCode,
      );
      return;
    }

    if (error instanceof Error) {
      request.log.error(
        {
          message: error.message,
        },
        error.message,
      );
      httpAdapter.reply(
        response,
        {
          code: "UNKNIWN_INTERNAL_SERVER_ERROR",
          message: "unknown internal server error",
        },
        500,
      );
      return;
    }

    request.log.error(
      {
        message: error,
      },
      error,
    );
    httpAdapter.reply(
      response,
      {
        code: "UNKNIWN_INTERNAL_SERVER_ERROR",
        message: "unknown internal server error",
      },
      500,
    );
  }
}
