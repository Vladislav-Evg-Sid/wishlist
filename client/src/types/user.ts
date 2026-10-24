import type { UUID } from "./shared";
export interface User {
  id: UUID;
  name: string;
  email: string;
  hash: number;
}
