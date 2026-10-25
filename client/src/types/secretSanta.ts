import type { UUID } from "./shared";

export type SecretSantaTeamStatus = "pairs-ready" | "collecting-members";

export interface SecretSantaTeam {
  id: UUID;
  title: string;
  membersCount: number;
  createdDate: Date;
  deliveryDate: Date;
  status: SecretSantaTeamStatus;
}

export interface UpcomingEvent {
  title: string;
  createdDate: Date;
  deliveryDate: Date;
}
