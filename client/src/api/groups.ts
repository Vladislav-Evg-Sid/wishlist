import { apiFetch } from "./baseApi";
import type { Groups } from "../types/groups";

interface groupRes {
  id: string;
  title: string;
}

export async function getUserGroups(): Promise<Groups> {
  const response = await apiFetch("/groups");
  if (!response.ok) {
    throw new Error(`${response.status}`);
  }
  const groupData: groupRes[] = await response.json();

  return new Map(groupData.map((group) => [group.id, group.title]));
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
