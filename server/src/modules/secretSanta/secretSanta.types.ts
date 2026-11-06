import type { SecretSantaTeamStage } from "../../db/schema.js";
import type { UUID } from "../../types/shared.js";

export interface SecretSantaTeam {
  id: UUID;
  title: string;
  membersCount: number;
  createdDate: Date;
  deliveryDate: Date;
  stage: SecretSantaTeamStage;
}

export interface SecretSantaTeamData {
  teamName: string;
  deliveryDate: Date;
}

export interface SecretSantaTeamInfo {
  id: UUID;
  name: string;
  deliveryDate: Date;
  creatorID: UUID;
}
