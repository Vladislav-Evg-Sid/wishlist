import { APP_GUARD } from "@nestjs/core";
import { Module } from "@nestjs/common";

import { OrdersModule } from "./modules/orders/orders.module.js";
import { AccessTokenGuard } from "./guard/require-access-token.guard.js";

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
  imports: [OrdersModule],
})
export class AppModule {}
