export type status = "Свободно" | "Забронировано" | "Подарено";

interface User {
  id: string;
  name: string;
  email: string;
  hash: number;
}

export interface CardData {
  id: string;
  title: string;
  icon: string;
  createdAt: string | Date;
  status: status;
  author: User;
  href: string;
}
