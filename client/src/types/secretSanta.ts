import type { UUID } from "./shared";

export type SecretSantaTeamStatus =
  | "finding-gift"
  | "create-team"
  | "gift-ready"
  | "delivery";

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
