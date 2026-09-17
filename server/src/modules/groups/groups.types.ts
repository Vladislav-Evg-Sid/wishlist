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
