import type { UserInfo, UsersListInGroup, UUID } from "./shared";

export type SecretSantaStage = 1 | 2 | 3 | 4;

export interface SecretSantaTeamDetails {
  id: UUID;
  title: string;
  createdDate: Date;
  deliveryDate: Date;
  stage: SecretSantaStage;
  isCreator: boolean;
  members: UsersListInGroup;
  recipient: UserInfo | null;
  isSantaGiftPrepared: boolean;
  isOwnGiftPrepared: boolean;
}
