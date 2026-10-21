import type { UUID } from "../../types/shared.js";

export interface GroupData {
  id: UUID;
  name: string;
}

export interface CreateGroup {
  groupName: string;
}

export interface GroupInfo {
  title: string;
  isCreator: boolean;
}

export interface UserData {
  id: UUID;
  name: string;
  hash: number;
}

export interface GroupUsersList {
  creator: UserData;
  members: UserData[];
}
