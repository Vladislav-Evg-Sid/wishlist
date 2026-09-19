export interface WishlistData {
  id: string;
  title: string;
}

export interface GroupUser {
  name: string;
  hash: number;
}

export interface GroupUsersList {
  creator: GroupUser;
  members: GroupUser[];
}
