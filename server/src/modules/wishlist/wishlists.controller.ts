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

  try {
    const wishlists = await getGroupWishlists(userID, groupID);

    res.status(200).json(wishlists);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "User not a member or creator") {
        res.status(403).send(error.message);
        return;
      }
      res.status(500).send(error.message);
      return;
    }
    res.status(500).send("Unknown internal Server error");
  }
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

  try {
    await addWishlist({
      creatorID: userID,
      groupID: wishlistDataRaw.group_id,
      name: wishlistDataRaw.title,
    });
    res.status(201).send();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "User not a member or creator") {
        res.status(403).send(error.message);
        return;
      }
      res.status(500).send(error.message);
      return;
    }
    res.status(500).send("Unknown internal Server error");
  }
}
