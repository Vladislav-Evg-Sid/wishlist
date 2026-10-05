import type {
  CreateWishlistRequestDTO,
  CreateWishlistResponseDTO,
  GetGroupWishlistRequestDTO,
  GetGroupWishlistResponseDTO,
} from "./wishlists.dto.js";
import { addWishlist, getGroupWishlists } from "./wishlists.service.js";

export async function getGroupWishlistRequest(
  req: GetGroupWishlistRequestDTO,
  res: GetGroupWishlistResponseDTO,
): Promise<void> {
  const userID = req.userId;
  if (!userID) {
    res.status(401).send();
    return;
  }
  const groupID = req.params.groupID;

  const wishlists = await getGroupWishlists(userID, groupID);

  res.status(200).json(wishlists);
}

export async function addWishlistRequest(
  req: CreateWishlistRequestDTO,
  res: CreateWishlistResponseDTO,
): Promise<void> {
  const userID = req.userId;
  if (!userID) {
    res.status(401).send();
    return;
  }
  const wishlistDataRaw = req.body;

  await addWishlist({
    creatorID: userID,
    groupID: wishlistDataRaw.group_id,
    name: wishlistDataRaw.title,
  });
  res.status(201).send();
}
