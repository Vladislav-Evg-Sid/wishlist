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
  description: string;
  icon: string;
  createdAt: string | Date;
  status: status;
  author: User;
  href: string;
  reservedBy: string | null;
}

export interface CardDataInsert {
  title: string;
  description: string;
  wishlistID: string;
  icon: string;
  href: string;
  creatorID: string;
}
