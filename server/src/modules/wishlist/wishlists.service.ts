import { Inject, Injectable } from "@nestjs/common";

import { checkGroupUserAccess } from "../../shared/checkUserGroup.js";
import { ForbidenError, NotFoundError } from "../../shared/errors.js";
import type { UUID } from "../../types/shared.js";
import type {
  CreateWishlistData,
  WishlistData,
  wishlistInfo,
} from "./wishlists.types.js";
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

  async getWishlistInfo(userID: UUID, wishlistID: UUID): Promise<wishlistInfo> {
    const groupID =
      await this.wishlistRepository.findGroupIDByWishlistID(wishlistID);
    if (!groupID) {
      throw new NotFoundError("Not found wishlist's group");
    }

    const userAccess = await checkGroupUserAccess(userID, groupID);
    if (!userAccess) {
      throw new ForbidenError("User not a member or creator");
    }

    const { title, creatorID } =
      await this.wishlistRepository.findWishlistInfo(wishlistID);

    return {
      title,
      isCreator: creatorID === userID,
    };
  }

  async deleteWishlist(userID: UUID, wishlistID: UUID): Promise<void> {
    const groupID =
      await this.wishlistRepository.findGroupIDByWishlistID(wishlistID);
    if (!groupID) {
      throw new NotFoundError("Not found wishlist's group");
    }

    const userAccess = await checkGroupUserAccess(userID, groupID);
    if (!userAccess) {
      throw new ForbidenError("User not a member or creator");
    }

    await this.wishlistRepository.deleteWishlist(wishlistID);
  }

  async updateWishlistName(
    userID: UUID,
    wishlistID: UUID,
    newName: string,
  ): Promise<void> {
    const groupID =
      await this.wishlistRepository.findGroupIDByWishlistID(wishlistID);
    if (!groupID) {
      throw new NotFoundError("Not found wishlist's group");
    }

    const userAccess = await checkGroupUserAccess(userID, groupID);
    if (!userAccess) {
      throw new ForbidenError("User not a member or creator");
    }

    this.wishlistRepository.updateWishlistName(wishlistID, newName);
  }
}
