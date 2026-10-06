import { logger } from "../../config/logger.js";
import { UnauthorizedError } from "../../shared/errors.js";
import type {
  CreateWishlistRequestDTO,
  CreateWishlistResponseDTO,
  GetGroupWishlistRequestDTO,
  GetGroupWishlistResponseDTO,
} from "./wishlists.http.dto.js";
import { addWishlist, getGroupWishlists } from "./wishlists.service.js";

export async function getGroupWishlistRequest(
  req: GetGroupWishlistRequestDTO,
  res: GetGroupWishlistResponseDTO,
): Promise<void> {
  const userID = req.userId;
  if (!userID) {
    throw new UnauthorizedError("");
  }
  logger.debug("user");
  const groupParams = res.locals.validateParams;
  logger.debug("params");

  const wishlists = await getGroupWishlists(userID, groupParams.groupID);
  logger.debug("done");

  res.status(200).json(wishlists);
}

export async function addWishlistRequest(
  req: CreateWishlistRequestDTO,
  res: CreateWishlistResponseDTO,
): Promise<void> {
  const userID = req.userId;
  if (!userID) {
    throw new UnauthorizedError("");
  }
  const wishlistData = res.locals.validateBody;

  await addWishlist({
    creatorID: userID,
    groupID: wishlistData.groupID,
    name: wishlistData.title,
  });
  res.status(201).send();
}
