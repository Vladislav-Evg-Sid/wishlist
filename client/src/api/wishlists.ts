import { type Wishlist } from "../types/wishlists";

export default function getWishlistsByGroup(groupID: string): Wishlist[] {
  // Имитация запроса на бэк
  switch (groupID) {
    case "123":
      return [
        {
          id: "123",
          name: "Подарки",
        },
      ];
    default:
      return [];
  }
}
