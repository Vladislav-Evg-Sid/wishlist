import type { Wishlist } from "../types/wishlists";

export default function getWishlistsByGroup(groupID: string): Wishlist[] {
  // Имитация запроса на бэк
  switch (groupID) {
    case "123":
      return [
        {
          id: "123",
          name: "Вишлист 1 группы 1",
        },
        {
          id: "124",
          name: "Вишлист 2 группы 1",
        },
      ];
    case "124":
      return [
        {
          id: "125",
          name: "Вишлист 1 группы 2",
        },
      ];
    default:
      return [];
  }
}
