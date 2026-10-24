import type { UUID } from "./shared";
export interface WishlistData {
  id: UUID;
  title: string;
}

export interface GroupUser {
  id: UUID;
  name: string;
  hash: number;
}

export interface GroupUsersList {
  creator: GroupUser;
  members: GroupUser[];
}
