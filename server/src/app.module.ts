import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { Module } from "@nestjs/common";

import { OrdersModule } from "./modules/orders/orders.module.js";
import { AccessTokenGuard } from "./guard/require-access-token.guard.js";
import { AppErrorFilter } from "./shared/filter/errorHandler.filter.js";

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AppErrorFilter,
    },
  ],
  imports: [OrdersModule],
})
export class AppModule {}
