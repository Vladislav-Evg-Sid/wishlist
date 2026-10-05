import type {
  OrderData,
  OrderDataChange,
  OrderDataInsert,
} from "../types/orders";
import { apiFetch } from "./baseApi";

export async function getWishlistOrders(
  wishlistID: string,
): Promise<OrderData[]> {
  const response = await apiFetch(`/orders/${wishlistID}`);
  if (!response.ok) {
    throw new Error(`${await response.text()}`);
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

export async function editOrder(order: OrderDataChange): Promise<void> {
  const response = await apiFetch(`/orders/${order.currentID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: order.title,
      icon: order.icon,
      description: order.description,
      href: order.href,
    }),
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("User not a member or creator");
    }
    throw new Error(`${response.status}`);
  }
}
