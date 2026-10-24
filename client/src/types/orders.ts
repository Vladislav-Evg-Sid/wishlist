import type { UUID } from "./shared";
import type { WishIconValue } from "../constants/wishIcons";
import type { User } from "./user";

type Status = "Свободно" | "Забронировано" | "Подарено";

export interface OrderData {
  id: number;
  title: string;
  description?: string;
  icon: WishIconValue;
  createdAt: string | Date;
  status: Status;
  author: User;
  reservedBy: UUID | null;
  href: string;
}

export interface OrderDataInsert {
  title: string;
  description: string;
  wishlistID: UUID;
  icon: WishIconValue;
  href: string;
}

export interface OrderDataChange {
  currentID: number;
  title: string;
  icon: WishIconValue;
  description: string;
  href: string;
}
