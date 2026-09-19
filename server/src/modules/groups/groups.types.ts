export interface GroupData {
  id: string;
  name: string;
}

export interface CreateGroup {
  groupName: string;
}

export interface GroupInfo {
  title: string;
  isCreator: boolean;
}

export interface GroupUser {
  name: string;
  hash: number;
}

export interface GroupUsersList {
  creator: GroupUser;
  members: GroupUser[];
}
