import type { UUID } from "../../types/shared.js";
import type { status } from "./orders.types.js";

export interface CardDataRaw {
  id: number;
  title: string;
  description: string;
  icon: string;
  created_at: string | Date;
  status: status;
  author_id: UUID;
  author_name: string;
  author_email: string;
  author_hash: number;
  reserved_by: UUID | null;
  href: string | null;
}
