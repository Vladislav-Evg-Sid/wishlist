import { NestFactory } from "@nestjs/core";
import { StandardSchemaValidationPipe } from "@nestjs/common";

import { AppModule } from "./app.module.js";
import { config } from "./config/env.js";
import { ValidationError } from "./shared/errors.js";
import { httpLogger } from "./middleware/logger.middleware.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(httpLogger);

  app.useGlobalPipes(
    new StandardSchemaValidationPipe({
      exceptionFactory: (issues) =>
        new ValidationError(
          issues.map((issue) => {
            const path = issue.path
              ?.map((segment) =>
                typeof segment === "object"
                  ? String(segment.key)
                  : String(segment),
              )
              .join(".");

            return {
              message: issue.message,
              ...(path ? { path } : {}),
            };
          }),
        ),
    }),
  );

  await app.listen(config.port);
}

await bootstrap();
