import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

import type { UUID } from "../../../types/shared.js";
import { UnauthorizedError } from "../../../shared/errors.js";

export const CurrentUserID = createParamDecorator(
  (data: unknown, context: ExecutionContext): UUID => {
    const request = context.switchToHttp().getRequest();

    if (!request.userId) {
      throw new UnauthorizedError("Not found user id");
    }

    return request.userId;
  },
);
