declare const uuidBrand: unique symbol;

export type UUID = string & {
  readonly [uuidBrand]: "UUID";
};

export interface UserData {
  id: UUID;
  name: string;
  hash: number;
}
