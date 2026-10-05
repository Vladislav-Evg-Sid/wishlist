import type { UUID } from "../../types/shared.js";

export type status = "Свободно" | "Забронировано" | "Подарено";

interface User {
  id: UUID;
  name: string;
  email: string;
  hash: number;
}

export interface CardData {
  id: number;
  title: string;
  description: string;
  icon: string;
  createdAt: string | Date;
  status: status;
  author: User;
  href: string;
  reservedBy: UUID | null;
}

export interface CardDataInsert {
  title: string;
  description: string;
  wishlistID: UUID;
  icon: string;
  href: string;
  creatorID: UUID;
}
