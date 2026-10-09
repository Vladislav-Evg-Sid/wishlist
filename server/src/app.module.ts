import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { Module } from "@nestjs/common";

import { AccessTokenGuard } from "./guard/require-access-token.guard.js";
import { AppErrorFilter } from "./shared/filter/errorHandler.filter.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { GroupModule } from "./modules/groups/groups.module.js";
import { WishlistsModule } from "./modules/wishlist/wishlists.module.js";
import { OrdersModule } from "./modules/orders/orders.module.js";

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
  imports: [AuthModule, GroupModule, WishlistsModule, OrdersModule],
})
export class AppModule {}
