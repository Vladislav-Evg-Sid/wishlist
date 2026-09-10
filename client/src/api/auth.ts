import { apiFetch } from "./baseApi";
import type { User } from "../types/user";

export async function getCurrentUser(): Promise<User | undefined> {
  const response = await apiFetch("/auth/me");
  if (!response.ok) {
    if (response.status === 401) {
      return;
    }
    throw new Error(`${response.status}`);
  }
  return await response.json();
}

export async function loginUser(
  email: string,
  password: string,
): Promise<void | string> {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(await response.text());
    }
    throw new Error(`${response.status}`);
  }
  const result = await response.json();
  return result.accessToken;
}
