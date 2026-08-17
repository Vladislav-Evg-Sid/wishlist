import { type Response } from "express";

import { type WishlistData } from "./wishlists.types.js";
import { type GetGroupWishlistRequestDTO } from "./wishlists.dto.js";

export function getGroupWishlist(
  req: GetGroupWishlistRequestDTO,
  res: Response<WishlistData[]>,
): void {
  const groupID = req.params.id;

  switch (groupID) {
    case "123":
      res.json([
        {
          id: "123",
          name: "Вишлист 1 группы 1",
        },
        {
          id: "124",
          name: "Вишлист 2 группы 1",
        },
      ]);
    case "124":
      res.json([
        {
          id: "125",
          name: "Вишлист 1 группы 2",
        },
      ]);
    default:
      res.json([]);
  }
}
