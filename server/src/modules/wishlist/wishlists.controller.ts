import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import type z from "zod";

import {
  WISHLIST_SERVICE,
  type WishlistsServiceInterface,
} from "./wishlists.di.js";
import { CurrentUserID } from "../auth/decorator/currentUserID.decorator.js";
import type { UUID } from "../../types/shared.js";
import {
  createWishlistBodySchema,
  deleteWishlistParamsSchema,
  getGroupWishlistsParamsSchema,
  getWishlistInfoParamsSchema,
  updateWishlistNameBody,
  updateWishlistNameParamsSchema,
} from "./wishlists.schemas.js";

@Controller("wishlists")
export class WishlistsController {
  constructor(
    @Inject(WISHLIST_SERVICE)
    private readonly wishlistService: WishlistsServiceInterface,
  ) {}

  @Get(":group_id")
  async getGroupWishlist(
    @Param({ schema: getGroupWishlistsParamsSchema })
    params: z.output<typeof getGroupWishlistsParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    return await this.wishlistService.getGroupWishlists(userID, params.groupID);
  }

  @Post()
  async addWishlist(
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

  @Get(":wishlist_id/info")
  async getWishlistInfo(
    @Param({ schema: getWishlistInfoParamsSchema })
    params: z.output<typeof getWishlistInfoParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    const { isCreator, title } = await this.wishlistService.getWishlistInfo(
      userID,
      params.wishlistID,
    );

    return {
      title,
      is_creator: isCreator,
    };
  }

  @Put(":wishlist_id")
  async updateWishlistName(
    @Param({ schema: updateWishlistNameParamsSchema })
    params: z.output<typeof updateWishlistNameParamsSchema>,
    @Body({ schema: updateWishlistNameBody })
    wishlistData: z.output<typeof updateWishlistNameBody>,
    @CurrentUserID()
    userID: UUID,
  ) {
    await this.wishlistService.updateWishlistName(
      userID,
      params.wishlistID,
      wishlistData.title,
    );
  }

  @Delete(":wishlist_id")
  async deleteWishlist(
    @Param({ schema: deleteWishlistParamsSchema })
    params: z.output<typeof deleteWishlistParamsSchema>,
    @CurrentUserID()
    userID: UUID,
  ) {
    await this.wishlistService.deleteWishlist(userID, params.wishlistID);
  }
}
