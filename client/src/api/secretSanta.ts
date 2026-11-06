import type {
  SecretSantaTeam,
  SecretSantaTeamStatus,
} from "../types/secretSanta";
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
  type SecretSantaTeamRaw = Omit<
    Omit<Omit<SecretSantaTeam, "deliveryDate">, "createdDate">,
    "status"
  > & {
    createdDate: string;
    deliveryDate: string;
    stage: SecretSantaTeamStatus;
  };

  const response = await apiFetch("/secret-santa");

  if (!response.ok) {
    await apiErrorHandler(response);
    return [];
  }

  const teams: SecretSantaTeamRaw[] = await response.json();
  return teams.map((team) => ({
    id: team.id,
    title: team.title,
    membersCount: team.membersCount,
    createdDate: new Date(team.createdDate),
    deliveryDate: new Date(team.deliveryDate),
    status: team.stage,
  }));
}
