import type { OrderData, OrderDataInsert } from "../types/orders";
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

  return response.json();
}

export async function addOrder(order: OrderDataInsert): Promise<void> {
  const response = await apiFetch("/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...order, wishlist_id: order.wishlistID }),
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("User not a member or creator");
    }
    throw new Error(`${response.status}`);
  }
}
