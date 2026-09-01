import type { User } from "../types/user";

export async function getCurrentUser(): Promise<User> {
  return {
    id: "123",
    name: "Владислав",
  };
}
