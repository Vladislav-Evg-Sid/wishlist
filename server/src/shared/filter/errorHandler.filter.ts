import type { HttpAdapterHost } from "@nestjs/core";
import {
  type ArgumentsHost,
  type ExceptionFilter,
  Catch,
} from "@nestjs/common";

import { AppError } from "../errors.js";

@Catch(AppError)
export class AppErrorFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(error: AppError, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const request = host.switchToHttp().getRequest();
    const response = host.switchToHttp().getResponse();

    request.log.warn(
      {
        errorCode: error.code,
        message: error.message,
        method: request.method,
        url: request.url,
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
  }
}
