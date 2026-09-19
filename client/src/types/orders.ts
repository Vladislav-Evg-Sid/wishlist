import type { User } from "./user";

type status = "Свободно" | "Забронировано" | "Подарено";

export interface OrderData {
  id: string;
  title: string;
  icon: unknown;
  createdAt: string | Date;
  status: status;
  author: User;
  href: string;
}
