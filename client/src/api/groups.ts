import { apiFetch } from "./baseApi";
import type { GroupData, GroupInfo } from "../types/groups";

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

export async function getGroupInfo(groupID: string): Promise<GroupInfo> {
  const response = await apiFetch(`/groups/${groupID}`);

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("User not a member or creator");
    }
    throw new Error(`${response.status}`);
  }

  const groupInfoRaw = await response.json();

  return {
    title: groupInfoRaw.title,
    isCreator: groupInfoRaw.is_creator,
  };
}
