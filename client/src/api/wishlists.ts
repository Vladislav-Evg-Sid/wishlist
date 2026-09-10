import type { WishlistData } from "../types/wishlists";

export async function getGroupWishlists(
  groupID: string,
): Promise<WishlistData[]> {
  // Имитация запроса на бэк
  switch (groupID) {
    case "123":
      return [];
    default:
      return [
        {
          id: "123",
          title: "Вишлист 1 группы 1",
        },
        {
          id: "124",
          title: "Вишлист 2 группы 1",
        },
      ];
    case "124":
      return [
        {
          id: "125",
          title: "Вишлист 1 группы 2",
        },
      ];
  }
}
