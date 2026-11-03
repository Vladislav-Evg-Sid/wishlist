import type { UUID } from "../../types/shared.js";

export type SecretSantaTeamStatus = "pairs-ready" | "collecting-members";

export interface SecretSantaTeam {
  id: UUID;
  title: string;
  membersCount: number;
  createdDate: Date;
  deliveryDate: Date;
  status: SecretSantaTeamStatus;
}

export interface SecretSantaTeamData {
  teamName: string;
  deliveryDate: Date;
}
