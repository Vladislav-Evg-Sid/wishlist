import type { SecretSantaTeamStage } from "../../db/schema.js";
import type { UUID } from "../../types/shared.js";
import type { UserData } from "../auth/auth.types.js";

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

export type SecretSantaStep = 1 | 2 | 3 | 4;

export interface TeamUsersList {
  creator: UserData;
  members: UserData[];
}

export interface SecretSantaTeamDetails {
  id: UUID;
  title: string;
  createdDate: Date;
  deliveryDate: Date;
  stage: SecretSantaStep;
  isCreator: boolean;
  members: TeamUsersList;
  recipient: UserData | null;
  isSantaGiftPrepared: boolean;
  isOwnGiftPrepared: boolean;
}

export interface SecretSantaWish {
  id: number;
  title: string;
  description: string;
  icon: string;
  href: string;
}
