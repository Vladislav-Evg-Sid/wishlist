import type { UUID } from "../types/shared";
import type {
  OrderData,
  OrderDataChange,
  OrderDataInsert,
} from "../types/orders";
import { apiErrorHandler, apiFetch } from "./baseApi";

export async function getWishlistOrders(
  wishlistID: UUID,
): Promise<OrderData[]> {
  const response = await apiFetch(`/orders/${wishlistID}`);

  if (!response.ok) {
    await apiErrorHandler(response);
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
    await apiErrorHandler(response);
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
    await apiErrorHandler(response);
  }
}

export async function deleteOrder(orderID: number): Promise<void> {
  const response = await apiFetch(`/orders/${orderID}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    await apiErrorHandler(response);
  }
}

export async function reserveOrder(orderID: number): Promise<void> {
  const response = await apiFetch(`/orders/${orderID}/reserve`, {
    method: "PATCH",
  });

  if (!response.ok) {
    await apiErrorHandler(response);
  }
}

export async function unreserveOrder(orderID: number): Promise<void> {
  const response = await apiFetch(`/orders/${orderID}/unreserve`, {
    method: "PATCH",
  });

  if (!response.ok) {
    await apiErrorHandler(response);
  }
}

export async function giveOrder(orderID: number): Promise<void> {
  const response = await apiFetch(`/orders/${orderID}/give`, {
    method: "PATCH",
  });

  if (!response.ok) {
    await apiErrorHandler(response);
  }
}
