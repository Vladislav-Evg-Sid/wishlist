import type { WishIconValue } from "../constants/wishIcons";
import type { User } from "./user";

type Status = "Свободно" | "Забронировано" | "Подарено";

export interface OrderData {
  id: string;
  title: string;
  description?: string;
  icon: WishIconValue;
  createdAt: string | Date;
  status: Status;
  author: User;
  /** TODO: заполнить на API для определения пользователя, установившего бронь. */
  reservedBy?: User | null;
  href: string;
}

export interface OrderDataInsert {
  title: string;
  description: string;
  wishlistID: string;
  icon: WishIconValue;
  href: string;
}
