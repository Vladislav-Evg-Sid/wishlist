declare const uuidBrand: unique symbol;

export type UUID = string & {
  readonly [uuidBrand]: "UUID";
};
