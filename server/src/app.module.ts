import { APP_FILTER } from "@nestjs/core";
import { Module } from "@nestjs/common";

import { AppErrorFilter } from "./shared/filter/errorHandler.filter.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { GroupModule } from "./modules/groups/groups.module.js";
import { WishlistsModule } from "./modules/wishlist/wishlists.module.js";
import { OrdersModule } from "./modules/orders/orders.module.js";

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppErrorFilter,
    },
  ],
  imports: [AuthModule, GroupModule, WishlistsModule, OrdersModule],
})
export class AppModule {}
