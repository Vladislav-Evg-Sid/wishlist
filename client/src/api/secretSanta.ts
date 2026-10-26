import type { SecretSantaTeam } from "../types/secretSanta";
import { apiErrorHandler, apiFetch } from "./baseApi";

export async function createTeam(
  teamName: string,
  deliveryDate: Date,
): Promise<void> {
  const response = await apiFetch("/secret-santa", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ team_name: teamName, delivery_date: deliveryDate }),
  });

  if (!response.ok) {
    await apiErrorHandler(response);
  }
}

export async function getUserTeams(): Promise<SecretSantaTeam[]> {
  const response = await apiFetch("/secret-santa");

  if (!response.ok) {
    await apiErrorHandler(response);
    return [];
  }

  return response.json();
}
