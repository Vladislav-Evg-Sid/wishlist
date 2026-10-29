export interface ParantInfo {
  title: string;
  isCreator: boolean;
}

export interface UserInfo {
  id: UUID;
  name: string;
  hash: number;
}

export interface UsersListInGroup {
  creator: UserInfo;
  members: UserInfo[];
}

declare const uuidBrand: unique symbol;

export type UUID = string & {
  readonly [uuidBrand]: "UUID";
};
