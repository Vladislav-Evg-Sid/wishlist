import { apiFetch } from "./baseApi";
import type { Groups } from "../types/groups";

interface groupRes {
  id: string;
  title: string;
}

export default async function getUserGroups(): Promise<Groups> {
  const response = await apiFetch("/groups");
  if (!response.ok) {
    throw new Error(`${response.status}`);
  }
  const groupData: groupRes[] = await response.json();

  return new Map(groupData.map((group) => [group.id, group.title]));
}
