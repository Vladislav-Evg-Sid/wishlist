import type { User } from "../types/user";

export async function getCurrentUser(): Promise<User> {
  return {
    id: "00000000-0000-0000-0000-000000000000",
    name: "Владислав",
  };
}
