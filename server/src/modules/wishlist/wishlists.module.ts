import { Module } from "@nestjs/common";

import { WishlistsController } from "./wishlists.controller.js";
import { WISHLIST_REPOSITORY, WISHLIST_SERVICE } from "./wishlists.di.js";
import { WishlistsService } from "./wishlists.service.js";
import { WishlistsRepository } from "./wishlists.repository.js";

@Module({
  controllers: [WishlistsController],
  providers: [
    { provide: WISHLIST_SERVICE, useClass: WishlistsService },
    { provide: WISHLIST_REPOSITORY, useClass: WishlistsRepository },
  ],
})
export class WishlistsModule {}
