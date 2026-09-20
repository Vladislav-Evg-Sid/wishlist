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

export interface CardDataInsert {
  title: string;
  description: string;
  wishlistID: string;
  icon: string;
  href: string;
  creatorID: string;
}
