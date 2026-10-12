import { Inject, Injectable } from "@nestjs/common";

import { checkGroupUserAccess } from "../../shared/checkUserGroup.js";
import { ForbidenError } from "../../shared/errors.js";
import type { UUID } from "../../types/shared.js";
import type { CreateWishlistData, WishlistData } from "./wishlists.types.js";
import {
  WISHLIST_REPOSITORY,
  type WishlistsServiceInterface,
  type WishlistsRepositoryInterface,
} from "./wishlists.di.js";

@Injectable()
export class WishlistsService implements WishlistsServiceInterface {
  constructor(
    @Inject(WISHLIST_REPOSITORY)
    private readonly wishlistRepository: WishlistsRepositoryInterface,
  ) {}

  async getGroupWishlists(
    userID: UUID,
    groupID: UUID,
  ): Promise<WishlistData[]> {
    const userAccess = await checkGroupUserAccess(userID, groupID);
    if (!userAccess) {
      throw new ForbidenError("User not a member or creator");
    }

    return this.wishlistRepository.findGroupWishlists(groupID);
  }

  async addWishlist(wishlist: CreateWishlistData): Promise<void> {
    const userAccess = await checkGroupUserAccess(
      wishlist.creatorID,
      wishlist.groupID,
    );
    if (!userAccess) {
      throw new ForbidenError("User not a member or creator");
    }

    await this.wishlistRepository.createWishlist(wishlist);
  }
}
