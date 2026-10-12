import { Body, Controller, Get, Inject, Param, Post } from "@nestjs/common";
import type z from "zod";

import {
  WISHLIST_SERVICE,
  type WishlistsServiceInterface,
} from "./wishlists.di.js";
import { CurrentUserID } from "../auth/decorator/currentUserID.decorator.js";
import type { UUID } from "../../types/shared.js";
import {
  createWishlistBodySchema,
  getGroupWishlistsParamsSchema,
} from "./wishlists.schemas.js";

@Controller("wishlists")
export class WishlistsController {
  constructor(
    @Inject(WISHLIST_SERVICE)
    private readonly wishlistService: WishlistsServiceInterface,
  ) {}

  @Get(":group_id")
  async getGroupWishlistRequest(
    @Param({ schema: getGroupWishlistsParamsSchema })
    params: z.output<typeof getGroupWishlistsParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    return await this.wishlistService.getGroupWishlists(userID, params.groupID);
  }

  @Post()
  async addWishlistRequest(
    @Body({ schema: createWishlistBodySchema })
    wishlistData: z.output<typeof createWishlistBodySchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    return await this.wishlistService.addWishlist({
      creatorID: userID,
      groupID: wishlistData.groupID,
      name: wishlistData.title,
    });
  }
}
