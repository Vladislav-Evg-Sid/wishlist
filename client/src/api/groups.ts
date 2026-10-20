import { apiErrorHandler, apiFetch } from "./baseApi";
import type { GroupData } from "../types/groups";
import type { GroupUsersList } from "../types/wishlists";
import type { ParantInfo } from "../types/shared";

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
    await apiErrorHandler(response);
  }
}

export async function getGroupInfo(groupID: string): Promise<ParantInfo> {
  const response = await apiFetch(`/groups/${groupID}`);

  if (!response.ok) {
    await apiErrorHandler(response);
  }

  const groupInfoRaw = await response.json();

  return {
    title: groupInfoRaw.title,
    isCreator: groupInfoRaw.is_creator,
  };
}

export async function getGroupUsers(groupID: string): Promise<GroupUsersList> {
  const response = await apiFetch(`/groups/${groupID}/users`);

  if (!response.ok) {
    await apiErrorHandler(response);
  }

  return await response.json();
}

export async function deleteGroup(groupID: string): Promise<void> {
  const response = await apiFetch(`/groups/${groupID}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    await apiErrorHandler(response);
  }
}

export async function updateGroupName(
  groupID: string,
  groupName: string,
): Promise<void> {
  const response = await apiFetch(`/groups/${groupID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: groupName,
    }),
  });

  if (!response.ok) {
    await apiErrorHandler(response);
  }
}

export async function createInviteCode(
  groupID: string,
  ttl?: number,
  limitMembers?: number,
) {
  const params = new URLSearchParams();

  if (ttl !== undefined) {
    params.set("ttl", String(ttl));
  }

  if (limitMembers !== undefined) {
    params.set("limit_members", String(limitMembers));
  }

  const response = await apiFetch(
    `/groups/${groupID}/invite?${params.toString()}`,
  );

  if (!response.ok) {
    await apiErrorHandler(response);
  }

  return response.text();
}
