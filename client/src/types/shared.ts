export interface ParantInfo {
  title: string;
  isCreator: boolean;
}

declare const uuidBrand: unique symbol;

export type UUID = string & {
  readonly [uuidBrand]: "UUID";
};
