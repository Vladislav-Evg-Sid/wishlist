import { NestFactory } from "@nestjs/core";
import { StandardSchemaValidationPipe } from "@nestjs/common";

import { AppModule } from "./app.module.js";
import { config } from "./config/env.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new StandardSchemaValidationPipe());

  await app.listen(config.port);
}

await bootstrap();
