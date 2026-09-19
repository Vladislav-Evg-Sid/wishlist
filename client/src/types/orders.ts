import type { WishIconValue } from "../components/gui/WishIcons";
import type { User } from "./user";

type status = "Свободно" | "Забронировано" | "Подарено";

export interface OrderData {
  id: string;
  title: string;
  icon: WishIconValue;
  createdAt: string | Date;
  status: status;
  author: User;
  href: string;
}
