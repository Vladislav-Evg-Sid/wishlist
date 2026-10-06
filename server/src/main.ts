import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";
import { config } from "./config/env.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(config.port);
}

await bootstrap();
