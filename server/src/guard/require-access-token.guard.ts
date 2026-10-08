import { type Reflector } from "@nestjs/core";
import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from "@nestjs/common";

import { verifyAccessToken } from "../modules/auth/jwt.service.js";
import { UnauthorizedError } from "../shared/errors.js";
import { IS_PUBLIC_KEY } from "../modules/auth/decorator/publicEndpoint.decorator.js";

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedError("Authorization header missing");
    }

    const [scheme, token] = authorization.split(" ");
    if (scheme !== "Bearer" || !token) {
      throw new UnauthorizedError("Invalid authorization header");
    }

    const payload = verifyAccessToken(token);
    request.userId = payload.sub;
    return true;
  }
}
