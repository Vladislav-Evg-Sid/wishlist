import type { OrderData } from "../types/orders";
import { apiFetch } from "./baseApi";

export async function getWishlistOrders(
  wishlistID: string,
): Promise<OrderData[]> {
  const response = await apiFetch(`/orders/${wishlistID}`);
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("User not a member or creator");
    }
    throw new Error(`${response.status}`);
  }

  const orders: OrderData[] = await response.json();

  return orders;
}
