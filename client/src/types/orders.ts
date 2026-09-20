import type { WishIconValue } from "../constants/wishIcons";
import type { User } from "./user";

type Status = "Свободно" | "Забронировано" | "Подарено";

export interface OrderData {
  id: string;
  title: string;
  icon: WishIconValue;
  createdAt: string | Date;
  status: Status;
  author: User;
  href: string;
}

export interface OrderDataInsert {
  title: string;
  description: string;
  wishlistID: string;
  icon: WishIconValue;
  href: string;
}
