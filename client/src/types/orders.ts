import type { WishIconValue } from "../constants/wishIcons";
import type { User } from "./user";

type Status = "Свободно" | "Забронировано" | "Подарено";
export type OrderID = string | number;

export interface OrderData {
  id: OrderID;
  title: string;
  description?: string;
  icon: WishIconValue;
  createdAt: string | Date;
  status: Status;
  author: User;
  reservedBy: string | null;
  href: string;
}

export interface OrderDataInsert {
  title: string;
  description: string;
  wishlistID: string;
  icon: WishIconValue;
  href: string;
}
