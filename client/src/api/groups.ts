import { apiFetch } from "./baseApi";
import type { GroupData } from "../types/groups";

export async function getUserGroups(): Promise<GroupData[]> {
  const response = await apiFetch("/groups");
  if (!response.ok) {
    throw new Error(`${response.status}`);
  }
  return await response.json();
}

export async function createGroup(groupName: string): Promise<void> {
  const response = await apiFetch("/groups", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ group_name: groupName }),
  });
  if (!response.ok) {
    throw new Error(`${response.status}`);
  }
}
